import buildConfig from '../constants/buildConfig'

export const isTtsActive = (content: string[] | null, languageCode: string): boolean => {
  const unsupportedLanguagesForTts = ['fa']
  return (
    Array.isArray(content) &&
    content.length > 0 &&
    buildConfig().featureFlags.tts &&
    !unsupportedLanguagesForTts.includes(languageCode)
  )
}
