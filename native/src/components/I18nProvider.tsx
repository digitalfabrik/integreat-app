import i18next from 'i18next'
import React, { ReactElement, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import { Text } from 'react-native'

import DateFormatter from 'api-client/src/i18n/DateFormatter'
import { config, loadTranslations } from 'translations'

import buildConfig from '../constants/buildConfig'
import DateFormatterContext from '../contexts/DateFormatterContext'
import appSettings from '../utils/AppSettings'
import NativeLanguageDetector from '../utils/NativeLanguageDetector'
import { setSystemLanguage } from '../utils/sendTrackingSignal'
import { reportError } from '../utils/sentry'

type I18nProviderProps = {
  children: ReactNode
}

const I18nProvider = ({ children }: I18nProviderProps): ReactElement | null => {
  const [errorMessage, setErrorMessage] = useState<string | null | undefined>(null)
  const [i18nextInstance, setI18nextInstance] = useState<typeof i18next | null>(null)

  const setContentLanguage = useCallback(async (uiLanguage: string) => {
    const contentLanguage = await appSettings.loadContentLanguage()

    if (!contentLanguage) {
      await appSettings.setContentLanguage(uiLanguage)
    }
  }, [])

  useEffect(() => {
    const initI18Next = async () => {
      const resources = loadTranslations(buildConfig().translationsOverride)
      const i18nextInstance = i18next.createInstance().use(NativeLanguageDetector)
      await i18nextInstance.init({
        resources,
        fallbackLng: { ...config.fallbacks, default: [config.defaultFallback] },

        /* Only allow supported languages (languages which can appear  in content of cms */
        supportedLngs: [...config.getSupportedLanguageTags(), ...config.getFallbackLanguageTags()],
        load: 'currentOnly',
        // If this is set to 'all' then i18next will try to load zh which is not in supportedLngs
        interpolation: {
          escapeValue: false,
          /* Escaping is not needed for react apps:
             https://github.com/i18next/react-i18next/issues/277 */
        },
      })
      // A language mentioned in the supportedLanguages array of the config.js in the translations package
      const matchedLanguage = i18nextInstance.languages[0]!
      await setContentLanguage(matchedLanguage).catch(reportError)
      setSystemLanguage(matchedLanguage)
      setI18nextInstance(i18nextInstance)
    }

    initI18Next().catch((e: Error) => {
      setErrorMessage(e.message)
      reportError(e)
    })
  }, [setContentLanguage])

  const dateFormatter = useMemo(() => new DateFormatter(config.defaultFallback), [])

  if (errorMessage) {
    return <Text>{errorMessage}</Text>
  }

  if (!i18nextInstance) {
    return null
  }

  return (
    <I18nextProvider i18n={i18nextInstance}>
      <DateFormatterContext.Provider value={dateFormatter}>{children}</DateFormatterContext.Provider>
    </I18nextProvider>
  )
}

export default I18nProvider
