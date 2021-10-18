/* eslint-disable no-console,camelcase */
import program from 'commander'
import fs from 'fs'
import yaml from 'js-yaml'
import path from 'path'

import {
  GITKEEP_FILE,
  PLATFORM_ANDROID,
  PLATFORM_IOS,
  PLATFORM_WEB,
  RELEASE_NOTES_DIR,
  UNRELEASED_DIR // @ts-ignore
} from './constants'

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
}
const MAX_RELEASE_NOTES_LENGTH = 500
const DEFAULT_NOTES_LANGUAGE = 'de'

const DEFAULT_NOTES = {
  en:
    'We’ve been working hard behind the scenes to make sure everything is working as it should. If you notice anything that does not work, let us know!\n',
  de:
    'Wir haben hinter den Kulissen hart gearbeitet, um sicherzustellen, dass alles so funktioniert, wie es soll. Wenn Sie bemerken, dass etwas nicht funktioniert, lassen Sie es uns wissen!\n'
}

program
  .option('--ios', 'include release notes for ios')
  .option('--android', 'include release notes for android')
  .option('--web', 'include release notes for web.')
  .option(
    '--production',
    'whether to hide extra information, e.g. issue keys, hidden notes and platforms and prepare the notes for a store. may not be used with multiple platforms.'
  )
  .option('--destination <destination>', 'if specified the parsed notes are saved to the directory')
  .requiredOption(
    '--source <source>',
    'the directory of the release notes to parse',
    `../${RELEASE_NOTES_DIR}/${UNRELEASED_DIR}`
  )
  .requiredOption('--language <language>', 'the language of the release notes to parse', DEFAULT_NOTES_LANGUAGE)

const formatNotes = (params: { notes: NoteType[]; language: string; production: boolean; platformName?: string }) => {
  const { notes, language, production, platformName } = params
  const noteLanguage = language === 'de' || language === 'en' ? language : DEFAULT_NOTES_LANGUAGE
  const defaultNote = production ? DEFAULT_NOTES[noteLanguage] : ''
  if (notes.length === 0) {
    return defaultNote
  }

  const formattedNotes = notes
    .map(note => {
      const localizedNote = note[noteLanguage] ?? note.en
      // Double quotes make mattermost status alerts fail
      const escapedNote = localizedNote.replace(/"/g, "'")
      return production ? `* ${escapedNote}` : `* [ ${note.issue_key} ] ${escapedNote}`
    })
    .reduce((text, note) => {
      if (production && text.length + note.length > MAX_RELEASE_NOTES_LENGTH) {
        return text
      }
      if (text.length === 0) {
        return note
      }
      return `${text}\n${note}`
    }, '')

  const notesWithDefault =
    production && defaultNote.length + formattedNotes.length > MAX_RELEASE_NOTES_LENGTH
      ? formattedNotes
      : `${defaultNote}${formattedNotes}`

  return platformName ? `\n${platformName}:\n${notesWithDefault}` : `${notesWithDefault}`
}

const isNoteRelevant = ({ note, platforms }: { note: NoteType; platforms: string[] }) =>
  platforms.some(platform => note.platforms.includes(platform))
const isNoteCommon = ({ note, platforms }: { note: NoteType; platforms: string[] }) =>
  platforms.every(platform => note.platforms.includes(platform))

const parseReleaseNotes = ({ source, ios, android, web, production, language }: ParseProgramType): string => {
  const platforms: string[] = []
  if (android) {
    platforms.push(PLATFORM_ANDROID)
  }
  if (ios) {
    platforms.push(PLATFORM_IOS)
  }
  if (web) {
    platforms.push(PLATFORM_WEB)
  }

  if (platforms.length === 0) {
    throw new Error('No platforms selected! Use --ios, --android and --web flags.')
  } else if (platforms.length > 1 && production) {
    // e.g. play store release notes should not contain ios release infos
    throw new Error('Usage of multiple platforms in production mode is not supported.')
  }

  if (!fs.existsSync(source)) {
    console.warn('Source not found. Nothing to do...')
    const noteLanguage = language === 'de' || language === 'en' ? language : DEFAULT_NOTES_LANGUAGE
    return DEFAULT_NOTES[noteLanguage]
  }

  const fileNames = fs.readdirSync(source)

  // Load all notes not belonging to a release
  const relevantNotes = fileNames
    .filter(fileName => fileName !== GITKEEP_FILE)
    // @ts-ignore
    .map((fileName: string): NoteType => yaml.safeLoad(fs.readFileSync(`${source}/${fileName}`)))
    .filter(note => isNoteRelevant({ note, platforms }))

  // If the production flag is set, hide information that is irrelevant for users
  if (production) {
    const productionNotes = relevantNotes.filter(note => note.show_in_stores)
    return formatNotes({ notes: productionNotes, language, production })
  }

  // Group notes by platform
  const emptyNodesMap = {
    common: [] as NoteType[],
    android: [] as NoteType[],
    ios: [] as NoteType[],
    web: [] as NoteType[]
  }
  const notesMap = relevantNotes.reduce((notesMap, note) => {
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
  }, emptyNodesMap)

  const commonNotes = formatNotes({ notes: notesMap.common, language, production })
  const androidNotes = formatNotes({ notes: notesMap.android, language, production, platformName: PLATFORM_ANDROID })
  const iosNotes = formatNotes({ notes: notesMap.ios, language, production, platformName: PLATFORM_IOS })
  const webNotes = formatNotes({ notes: notesMap.web, language, production, platformName: PLATFORM_WEB })

  const releaseNotes = `${commonNotes}${androidNotes}${iosNotes}${webNotes}`
  return `Release Notes:\n${releaseNotes || 'No release notes found. Looks like nothing happened for a while.'}`
}

const parseNotesProgram = (program: ParseProgramType) => {
  try {
    console.warn(program.source)
    console.warn(__dirname)
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
  .command('parse-release-notes')
  .description(
    'parse the release notes and outputs the release notes as JSON string and writes them to the specified file'
  )
  // @ts-ignore
  .action(() => parseNotesProgram({ ...program }))

// General store metadata
type StoreName = 'apple' | 'google'

const APPLE_NAME_LENGTH = 30
const APPLE_SUBTITLE_LENGTH = 30
const APPLE_RELEASE_NOTE_LENGTH = 4000
const APPLE_PROMOTIONAL_TEXT_LENGTH = 170
const APPLE_DESCRIPTION_LENGTH = 4000
const APPLE_KEYWORDS_LENGTH = 60

const GOOGLE_NAME_LENGTH = 50
const GOOGLE_SHORT_DESCRIPTION_LENGTH = 80
const GOOGLE_FULL_DESCRIPTION_LENGTH = 4000

const metadataPath = (appName: string, storeName: StoreName, languageCode: string) =>
  `../native/${storeName === 'apple' ? 'ios' : 'android'}/fastlane/${appName}/metadata/${languageCode}`

// Maps our translation keys to the right key used by the apple app store
// Empty array means no translation in the store
const appleLanguageMap: Record<string, string[]> = {
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
  pes: [],
  pl: ['pl'],
  ro: ['ro'],
  ru: ['ru'],
  tr: ['tr']
}

// Maps our translation keys to the right key used by the google play store
const googleLanguageMap: Record<string, string[]> = {
  am: ['am'],
  bg: ['bg'],
  de: ['de-DE'],
  el: ['el-GR'],
  en: ['en-US', 'en-GB'],
  es: ['es-ES'],
  fr: ['fr-FR'],
  hr: ['hr'],
  hu: ['hu-HU'],
  it: ['it-IT'],
  pes: ['fa'],
  pl: ['pl-PL'],
  ro: ['ro'],
  ru: ['ru-RU'],
  tr: ['tr-TR']
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

  return storeName === 'apple'
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
  storeName === 'apple' ? appleLanguageMap : googleLanguageMap

const writeMetadata = (appName: string, storeName: string, overrideVersionName?: string) => {
  if (storeName !== 'apple' && storeName !== 'google') {
    throw new Error(`Invalid store name ${storeName} passed!`)
  }

  const storeTranslations = JSON.parse(fs.readFileSync(`../translations/store-translations/${appName}.json`, 'utf-8'))

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
      const platforms = { ios: storeName === 'apple', android: storeName === 'google', web: false }
      const source = `${RELEASE_NOTES_DIR}/${overrideVersionName ?? UNRELEASED_DIR}`
      const releaseNotesPath = `${metadataPath(appName, storeName, targetLanguage)}${
        storeName === 'google' ? '/changelogs' : ''
      }`
      fs.mkdirSync(releaseNotesPath, { recursive: true })

      const destination = `${releaseNotesPath}/${storeName === 'apple' ? 'release_notes.txt' : 'default.txt'}`
      parseNotesProgram({ ...platforms, production: true, language, destination, source })

      console.warn(`${storeName} metadata for ${appName} successfully written in language ${targetLanguage}.`)
    })
  })
}

program.option(
  '--override-version-name',
  'if specified the release notes will be generated from the specified version name instead of the unreleased notes'
)

program
  .command('prepare-metadata <appName> <storeName>')
  .description('prepare metadata for store')
  .action((appName: string, storeName: string, overrideVersionName?: string) => {
    try {
      writeMetadata(appName, storeName, overrideVersionName)
    } catch (e) {
      console.error(e)
      process.exit(1)
    }
  })
program.parse(process.argv)
