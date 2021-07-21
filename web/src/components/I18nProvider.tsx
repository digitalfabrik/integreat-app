import i18next, { i18n } from 'i18next'
import React, { ReactElement, ReactNode, useEffect, useMemo, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import { Helmet as ReactHelmet } from 'react-helmet'
import { loadTranslations, config } from 'translations'
import { DateFormatter } from 'api-client'
import DateFormatterContext from '../contexts/DateFormatterContext'
import buildConfig from '../constants/buildConfig'
import BrowserLanguageDetectorService from '../utils/BrowserLanguageDetector'

type PropsType = {
  contentLanguage: string | undefined
  children: ReactNode
}

const I18nProvider = ({ children, contentLanguage }: PropsType): ReactElement => {
  const [language, setLanguage] = useState<string>(config.defaultFallback)
  const [errorMessage, setErrorMessage] = useState<string | null | undefined>(null)
  const [i18nextInstance, setI18nextInstance] = useState<i18n | null>(null)

  useEffect(() => {
    const initI18Next = async () => {
      const resources = loadTranslations(buildConfig().translationsOverride)
      const i18nextInstance = i18next.createInstance().use(BrowserLanguageDetectorService)
      await i18nextInstance.init({
        resources,
        fallbackLng: {
          ...config.fallbacks,
          default: [config.defaultFallback]
        },

        /* Only allow supported languages (languages which can appear  in content of cms */
        supportedLngs: [...config.getSupportedLanguageTags(), ...config.getFallbackLanguageTags()],
        load: 'currentOnly',
        // If this is set to 'all' then i18next will try to load zh which is not in supportedLngs
        interpolation: {
          escapeValue: false
          /* Escaping is not needed for react apps:
               https://github.com/i18next/react-i18next/issues/277 */
        },
        debug: buildConfig().featureFlags.developerFriendly
      })
      setI18nextInstance(i18nextInstance)
      // Apply ui language as language
      i18nextInstance.on('languageChanged', () => {
        console.log(i18nextInstance.languages)
        // A language mentioned in the supportedLanguages array of the config.js in the translations package
        const matchedLanguage = i18nextInstance.languages[0]
        setLanguage(matchedLanguage)
      })
    }

    initI18Next().catch((e: Error) => {
      setErrorMessage(e.message)
      console.error(e)
    })
  }, [])

  // Apply contentLanguage as language
  useEffect(() => {
    if (i18nextInstance && contentLanguage) {
      i18nextInstance.changeLanguage(contentLanguage, () => {
        setLanguage(contentLanguage)
      })
    }
  }, [i18nextInstance, contentLanguage])

  // Apply side effects
  useEffect(() => {
    if (document.documentElement) {
      document.documentElement.lang = language
    }
  }, [language])

  const additionalFont = config.getAdditionalFont(language)
  const dateFormatter = useMemo(() => new DateFormatter(config.defaultFallback), [])

  if (errorMessage) {
    return <>{errorMessage}</>
  }

  if (!i18nextInstance) {
    return <></>
  }

  return (
    <I18nextProvider i18n={i18nextInstance}>
      <div
        data-testid={'direction'}
        dir={config.isSupportedLanguage(language) ? (config.hasRTLScript(language) ? 'rtl' : 'ltr') : undefined}>
        <ReactHelmet>
          {additionalFont === 'lateef' && <link href='/fonts/lateef/lateef.css' rel='stylesheet' />}
          {additionalFont === 'noto-sans-sc' && <link href='/fonts/noto-sans-sc/noto-sans-sc.css' rel='stylesheet' />}
          {additionalFont === 'noto-sans-georgian' && (
            <link href='/fonts/noto-sans-georgian/noto-sans-georgian.css' rel='stylesheet' />
          )}
          <link href='/fonts/open-sans/open-sans.css' rel='stylesheet' />
          <link href='/fonts/raleway/raleway.css' rel='stylesheet' />
          <link href='/fonts/varela-round/varela-round.css' rel='stylesheet' />
        </ReactHelmet>
        <DateFormatterContext.Provider value={dateFormatter}>{children}</DateFormatterContext.Provider>
      </div>
    </I18nextProvider>
  )
}

export default I18nProvider
