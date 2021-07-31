import * as React from 'react'
import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import DateFormatterContext from '../contexts/DateFormatterContext'
import { Text } from 'react-native'
import buildConfig from '../constants/buildConfig'
import { config, loadTranslations } from 'translations'
import i18next from 'i18next'
import { useDispatch } from 'react-redux'
import { SetContentLanguageActionType } from '../redux/StoreActionType'
import NativeLanguageDetector from '../utils/NativeLanguageDetector'
import AppSettings from '../utils/AppSettings'
import DateFormatter from 'api-client/src/i18n/DateFormatter'
import { setSystemLanguage } from '../utils/sendTrackingSignal'

type PropsType = {
  children: React.ReactNode
}

export default ({ children }: PropsType): ReactElement | null => {
  const [errorMessage, setErrorMessage] = useState<string | null | undefined>(null)
  const [i18nextInstance, setI18nextInstance] = useState<typeof i18next | null>(null)
  const dispatch = useDispatch()

  const setContentLanguage = useCallback(
    async (uiLanguage: string) => {
      const appSettings = new AppSettings()
      const contentLanguage = await appSettings.loadContentLanguage()

      if (!contentLanguage) {
        await appSettings.setContentLanguage(uiLanguage)
      }

      const setContentLanguageAction: SetContentLanguageActionType = {
        type: 'SET_CONTENT_LANGUAGE',
        params: {
          contentLanguage: contentLanguage || uiLanguage
        }
      }
      dispatch(setContentLanguageAction)
    },
    [dispatch]
  )

  useEffect(() => {
    const initI18Next = async () => {
      const resources = loadTranslations(buildConfig().translationsOverride)
      const i18nextInstance = await i18next.createInstance().use(NativeLanguageDetector)
      await i18nextInstance.init({
        resources,
        fallbackLng: { ...config.fallbacks, default: [config.defaultFallback] },

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
      // A language mentioned in the supportedLanguages array of the config.js in the translations package
      const matchedLanguage = i18nextInstance.languages[0]
      await setContentLanguage(matchedLanguage).catch(e => {
        console.error(e)
      })
      setSystemLanguage(matchedLanguage)
      setI18nextInstance(i18nextInstance)
    }

    initI18Next().catch((e: Error) => {
      setErrorMessage(e.message)
      console.error(e)
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
