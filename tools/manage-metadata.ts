/* eslint-disable camelcase */
import { program } from 'commander'
import fs from 'fs'
import yaml from 'js-yaml'
import path from 'path'

import {
  GITKEEP_FILE,
  PLATFORM_ANDROID,
  PLATFORM_IOS,
  PLATFORM_WEB,
  RELEASE_NOTES_DIR,
  UNRELEASED_DIR
} from './constants'

const loadStoreTranslations = (appName: string) =>
  JSON.parse(fs.readFileSync(`../translations/store-translations/${appName}.json`, 'utf-8'))

// Release notes
type Platform = 'ios' | 'android' | 'web'
type NoteType = {
  show_in_stores: boolean
  issue_key: string
  platforms: Platform
  de?: string
  en: string
}
type ParseProgramType = {
  destination?: string
  source: string
  ios: boolean
  android: boolean
  web: boolean
  language: string
  production: boolean
  appName?: string
}
const MAX_RELEASE_NOTES_LENGTH = 500
const DEFAULT_NOTES_LANGUAGE = 'de'

const prepareDefaultReleaseNote = (language: string, production: boolean, appName?: string): string => {
  if (!production) {
    return ''
  }
  if (!appName) {
    throw new Error('No app name supplied while preparing notes for production!')
  }
  const common = loadStoreTranslations(appName).common
  return common[language]?.defaultReleaseNote ?? common[DEFAULT_NOTES_LANGUAGE].defaultReleaseNote
}

const formatNotes = (params: {
  notes: NoteType[]
  language: string
  production: boolean
  platformName?: string
  appName?: string
}) => {
  const { notes, language, production, platformName, appName } = params
  const defaultReleaseNote = prepareDefaultReleaseNote(language, production, appName)

  const formattedNotes = notes
    .map(note => {
      const localizedNote = language === 'en' || !note.de ? note.en : note.de
      // Double quotes make mattermost status alerts fail
      const escapedNote = localizedNote.replace(/"/g, "'")
      return production ? `* ${escapedNote}` : `* [ ${note.issue_key} ] ${escapedNote}`
    })
    .reduce((text, note) => {
      // Make sure release notes don't get longer than the maximal allowed length
      if (production && text.length + note.length > MAX_RELEASE_NOTES_LENGTH) {
        return text
      }
      if (text.length === 0) {
        return note
      }
      return `${text}\n${note}`
    }, defaultReleaseNote)

  return platformName && formattedNotes ? `\n${platformName}:\n${formattedNotes}` : formattedNotes
}

const isNoteRelevant = ({ note, platforms }: { note: NoteType; platforms: string[] }) =>
  platforms.some(platform => note.platforms.includes(platform))
const isNoteCommon = ({ note, platforms }: { note: NoteType; platforms: string[] }) =>
  platforms.every(platform => note.platforms.includes(platform))

// Format the release notes for development purposes with all available information
const formatDevelopmentNotes = (params: { notes: NoteType[]; language: string; platforms: string[] }) => {
  const { notes, language, platforms } = params
  const emptyNotesMap = {
    common: [] as NoteType[],
    android: [] as NoteType[],
    ios: [] as NoteType[],
    web: [] as NoteType[]
  }
  // Group notes by platform
  const notesMap = notes.reduce((notesMap, note) => {
    if (isNoteCommon({ note, platforms })) {
      notesMap.common.push(note)
    } else if (isNoteRelevant({ note, platforms: [PLATFORM_ANDROID] })) {
      notesMap.android.push(note)
    } else if (isNoteRelevant({ note, platforms: [PLATFORM_IOS] })) {
      notesMap.ios.push(note)
    } else if (isNoteRelevant({ note, platforms: [PLATFORM_WEB] })) {
      notesMap.web.push(note)
    }
    return notesMap
  }, emptyNotesMap)

  const commonNotes = formatNotes({ notes: notesMap.common, language, production: false })
  const androidNotes = formatNotes({
    notes: notesMap.android,
    language,
    production: false,
    platformName: PLATFORM_ANDROID
  })
  const iosNotes = formatNotes({ notes: notesMap.ios, language, production: false, platformName: PLATFORM_IOS })
  const webNotes = formatNotes({ notes: notesMap.web, language, production: false, platformName: PLATFORM_WEB })

  const releaseNotes = `${commonNotes}${androidNotes}${iosNotes}${webNotes}`
  return `Release Notes:\n${releaseNotes || 'No release notes found. Looks like nothing happened for a while.'}`
}

const parseReleaseNotes = ({ source, ios, android, web, production, language, appName }: ParseProgramType): string => {
  const platforms: string[] = [
    android ? PLATFORM_ANDROID : undefined,
    ios ? PLATFORM_IOS : undefined,
    web ? PLATFORM_WEB : undefined
  ].filter((platform): platform is string => !!platform)

  if (platforms.length === 0) {
    throw new Error('No platforms selected! Use --ios, --android and --web flags.')
  } else if (platforms.length > 1 && production) {
    // e.g. play store release notes should not contain ios release infos
    throw new Error('Usage of multiple platforms in production mode is not supported.')
  }

  const fileNames = fs.existsSync(source) ? fs.readdirSync(source) : []
  if (fileNames.length === 0) {
    console.warn(`No release notes found in source ${source}. Using default notes.`)
  }

  const asNoteType = (as: unknown): NoteType => as as NoteType

  // Load all notes not belonging to a release
  const relevantNotes = fileNames
    .filter(fileName => fileName !== GITKEEP_FILE)
    .map(fileName => asNoteType(yaml.load(fs.readFileSync(`${source}/${fileName}`, 'utf-8'))))
    .filter(note => isNoteRelevant({ note, platforms }))

  // If the production flag is set, hide information that is irrelevant for users
  if (production) {
    const productionNotes = relevantNotes.filter(note => note.show_in_stores)
    return formatNotes({ notes: productionNotes, language, production, appName })
  }

  return formatDevelopmentNotes({ notes: relevantNotes, language, platforms })
}

const parseNotesProgram = (program: ParseProgramType) => {
  try {
    const notes = parseReleaseNotes({ ...program })

    if (program.destination) {
      fs.mkdirSync(path.dirname(program.destination), { recursive: true })
      fs.writeFileSync(program.destination, notes)
    }

    // Log to enable bash piping
    console.log(JSON.stringify(notes))
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

program
  .option('--ios', 'include release notes for ios')
  .option('--android', 'include release notes for android')
  .option('--web', 'include release notes for web.')
  .option(
    '--production',
    'whether to hide extra information, e.g. issue keys, hidden notes and platforms and prepare the notes for a store. may not be used with multiple platforms. If set to true, make sure to pass the app name as well.'
  )
  .option('--app-name <app-name>', 'the name of the app to prepare the notes for. Only used if production flag is set.')
  .option('--destination <destination>', 'if specified the parsed notes are saved to the directory')
  .requiredOption(
    '--source <source>',
    'the directory of the release notes to parse',
    `../${RELEASE_NOTES_DIR}/${UNRELEASED_DIR}`
  )
  .requiredOption('--language <language>', 'the language of the release notes to parse', DEFAULT_NOTES_LANGUAGE)
  .command('parse-release-notes')
  .description(
    'parse the release notes and outputs the release notes as JSON string and writes them to the specified file'
  )
  // @ts-expect-error
  .action(() => parseNotesProgram({ ...program }))

// General store metadata
type StoreName = 'appstore' | 'playstore'

const APPSTORE_NAME_LENGTH = 30
const APPSTORE_SUBTITLE_LENGTH = 30
const APPSTORE_RELEASE_NOTE_LENGTH = 4000
const APPSTORE_PROMOTIONAL_TEXT_LENGTH = 170
const APPSTORE_DESCRIPTION_LENGTH = 4000
const APPSTORE_KEYWORDS_LENGTH = 60

const PLAYSTORE_NAME_LENGTH = 50
const PLAYSTORE_SHORT_DESCRIPTION_LENGTH = 80
const PLAYSTORE_FULL_DESCRIPTION_LENGTH = 4000

const metadataPath = (appName: string, storeName: StoreName, languageCode: string) =>
  `../native/${storeName === 'appstore' ? 'ios' : 'android'}/fastlane/${appName}/metadata/${languageCode}`

// Maps our translation keys to the right key used by the appstore
// Empty array means no translation in the store
// https://docs.fastlane.tools/actions/deliver/#available-language-codes
const appstoreLanguageMap: Record<string, string[]> = {
  am: [],
  ar: ['ar-SA'],
  bg: [],
  de: ['de-DE'],
  el: ['el'],
  en: ['en-US'],
  es: ['es-ES'],
  fr: ['fr-FR'],
  hr: ['hr'],
  hu: ['hu'],
  it: ['it'],
  ka: [],
  mk: [],
  pes: [],
  pl: ['pl'],
  prs: [],
  ro: ['ro'],
  ru: ['ru'],
  sq: [],
  tr: ['tr'],
  uk: ['uk'],
  ur: [],
  'zh-CN': ['zh-Hans']
}

// Maps our translation keys to the right key used by the play store
// https://support.google.com/googleplay/android-developer/answer/9844778?hl=en#zippy=%2Cview-list-of-available-languages%2Cif-you-dont-add-or-purchase-translations
const playstoreLanguageMap: Record<string, string[]> = {
  am: ['am'],
  ar: ['ar'],
  bg: ['bg'],
  de: ['de-DE'],
  el: ['el-GR'],
  en: ['en-US', 'en-GB'],
  es: ['es-ES'],
  fr: ['fr-FR'],
  hr: ['hr'],
  hu: ['hu-HU'],
  it: ['it-IT'],
  ka: ['ka-GE'],
  mk: ['mk-MK'],
  pes: ['fa'],
  prs: ['fa-AF'],
  pl: ['pl-PL'],
  ro: ['ro'],
  ru: ['ru-RU'],
  sq: ['sq'],
  tr: ['tr-TR'],
  uk: ['uk'],
  ur: ['ur'],
  'zh-CN': ['zh-CN']
}

program.version('0.1.0').option('-d, --debug', 'enable extreme logging')

// Record<storeName, Record<language, Record<metadataKey, metadataValue>>>
type StoreTranslationType = Record<string, Record<string, Record<string, string>>>

// Merges the metadata of the store with the common metadata in a specific language
const metadataFromTranslations = (
  storeName: StoreName,
  language: string,
  translations: StoreTranslationType
): Record<string, string> => {
  const commonTranslation = translations.common![language]!
  const name = commonTranslation.name!
  const description = commonTranslation.description!
  const storeTranslation = translations[storeName]![language]!

  return storeName === 'appstore'
    ? {
        name,
        description,
        ...storeTranslation
      }
    : {
        title: name,
        full_description: description,
        ...storeTranslation
      }
}

const languageMap = (storeName: StoreName): Record<string, string[]> =>
  storeName === 'appstore' ? appstoreLanguageMap : playstoreLanguageMap

const writeMetadata = (appName: string, storeName: string, overrideVersionName?: string) => {
  if (storeName !== 'appstore' && storeName !== 'playstore') {
    throw new Error(`Invalid store name ${storeName} passed!`)
  }

  const storeTranslations = loadStoreTranslations(appName)

  Object.keys(storeTranslations[storeName]).forEach(language => {
    const metadata = metadataFromTranslations(storeName, language, storeTranslations)
    const targetLanguages = languageMap(storeName)[language] ?? [language]

    targetLanguages.forEach(targetLanguage => {
      const path = metadataPath(appName, storeName, targetLanguage)
      fs.mkdirSync(path, {
        recursive: true
      })

      Object.keys(metadata).forEach(metadataKey => {
        fs.writeFileSync(`${path}/${metadataKey}.txt`, metadata[metadataKey]!)
      })

      // Prepare release notes
      const platforms = { ios: storeName === 'appstore', android: storeName === 'playstore', web: false }
      const source = `../${RELEASE_NOTES_DIR}/${overrideVersionName ?? UNRELEASED_DIR}`
      const releaseNotesPath = `${metadataPath(appName, storeName, targetLanguage)}${
        storeName === 'playstore' ? '/changelogs' : ''
      }`
      fs.mkdirSync(releaseNotesPath, { recursive: true })

      const destination = `${releaseNotesPath}/${storeName === 'appstore' ? 'release_notes.txt' : 'default.txt'}`
      parseNotesProgram({ ...platforms, production: true, language, destination, source, appName })

      console.warn(`${storeName} metadata for ${appName} successfully written in language ${targetLanguage}.`)
    })
  })
}

program
  .option(
    '--override-version-name <override-version-name>',
    'if specified the release notes will be generated from the specified version name instead of the unreleased notes'
  )
  .command('prepare-metadata <appName> <storeName>')
  .description('prepare metadata for store')
  .action((appName: string, storeName: string) => {
    try {
      writeMetadata(appName, storeName, program.overrideVersionName)
    } catch (e) {
      console.error(e)
      process.exit(1)
    }
  })
program.parse(process.argv)
