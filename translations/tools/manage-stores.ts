/* eslint-disable no-console */
import program from 'commander'
import fs from 'fs'

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
  en: ['en-US'],
  es: ['es-ES'],
  pes: [],
  fr: ['fr-FR']
}

// Maps our translation keys to the right key used by the google play store
const googleLanguageMap: Record<string, string[]> = {
  de: ['de-DE'],
  el: ['el-GR'],
  en: ['en-US', 'en-GB'],
  es: ['es-ES'],
  pes: ['fa'],
  fr: ['fr-FR'],
  hu: ['hu-HU'],
  it: ['it-IT'],
  pl: ['pl-PL'],
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

const writeMetadata = (appName: string, storeName: string) => {
  if (storeName !== 'apple' && storeName !== 'google') {
    throw new Error(`Invalid store name ${storeName} passed!`)
  }

  const storeTranslations = JSON.parse(fs.readFileSync(`store-translations/${appName}.json`, 'utf-8'))

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
      console.warn(`${storeName} metadata for ${appName} successfully written in language ${targetLanguage}.`)
    })
  })
}

program
  .command('prepare-metadata <appName> <storeName>')
  .description('prepare metadata for store')
  .action((appName: string, storeName: string) => {
    try {
      writeMetadata(appName, storeName)
    } catch (e) {
      console.error(e)
      process.exit(1)
    }
  })
program.parse(process.argv)
