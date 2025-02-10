import { useTranslation } from 'react-i18next'
import { useMatch } from 'react-router-dom'

type languageHelperType = {
  language: string
  routeParam0: string | undefined
  splat: string | undefined
}

export const DetectedLanguageHelper = (): languageHelperType => {
  const { routeParam0, routeParam1, '*': splat } = useMatch('/:routeParam0/:routeParam1/*')?.params ?? {}
  const { i18n } = useTranslation()
  const detectedLanguageCode = i18n.language
  const language = routeParam1 ?? detectedLanguageCode
  return { language, routeParam0, splat }
}
