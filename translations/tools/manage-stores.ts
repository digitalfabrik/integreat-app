/* eslint-disable no-console */
import program from 'commander'
import fs from 'fs'

const APPLE_NAME_LENGTH = 30
const APPLE_SUBTITLE_LENGTH = 30
const APPLE_RELEASE_NOTE_LENGTH = 4000
const APPLE_PROMOTIONAL_TEXT_LENGTH = 170
const APPLE_DESCRIPTION_LENGTH = 4000
const APPLE_KEYWORDS_LENGTH = 60

const GOOGLE_NAME_LENGTH = 50
const GOOGLE_SHORT_DESCRIPTION_LENGTH = 80
const GOOGLE_FULL_DESCRIPTION_LENGTH = 4000

const appleMetadataPath = (appName: string, languageCode: string) =>
  `../native/ios/fastlane/${appName}/metadata/${languageCode}`
const googleMetadataPath = (appName: string, languageCode: string) =>
  `../native/android/fastlane/${appName}/metadata/${languageCode}`

const appleLanguageMap: Record<string, string[]> = {
  en: ['en-US', 'en-GB'],
  de: ['de-DE']
}

const googleLanguageMap: Record<string, string[]> = {
  en: ['en-US', 'en-GB'],
  de: ['de-DE']
}

program.version('0.1.0').option('-d, --debug', 'enable extreme logging')

const writeGoogleMetadata = (appName: string) => {
  const storeTranslations = JSON.parse(fs.readFileSync(`store-translations/${appName}.json`, 'utf-8'))

  Object.keys(storeTranslations.google).forEach(language => {
    const googleTranslations = {
      title: storeTranslations.common[language].name,
      full_description: storeTranslations.common[language].description,
      ...storeTranslations.google[language]
    }
    const targetLanguages = googleLanguageMap[language] ?? [language]
    targetLanguages.forEach(targetLanguage => {
      const path = googleMetadataPath(appName, targetLanguage)
      fs.mkdirSync(path, {
        recursive: true
      })

      Object.keys(googleTranslations).forEach(metadataKey => {
        fs.writeFileSync(`${path}/${metadataKey}.txt`, googleTranslations[metadataKey])
      })
    })
  })
  console.warn('Google metadata successfully written.')
}

program
  .command('prepare-google-metadata <appName>')
  .description('prepare metadata for play store')
  .action((appName: string) => {
    try {
      writeGoogleMetadata(appName)
    } catch (e) {
      console.error(e)
      process.exit(1)
    }
  })
program.parse(process.argv)
