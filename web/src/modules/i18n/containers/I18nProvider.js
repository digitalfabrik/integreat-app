// @flow

import i18next from 'i18next'
import * as React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import { Helmet as ReactHelmet } from 'react-helmet'
import setUiDirection from '../actions/setUIDirection'
import { loadTranslations, config } from 'translations'
import buildConfig from '../../app/constants/buildConfig'
import { useDispatch, useSelector } from 'react-redux'
import type { StateType } from '../../app/StateType'
import BrowserLanguageDetector from '../BrowserLanguageDetector'
import DateFormatter from 'api-client/src/i18n/DateFormatter'
import DateFormatterContext from '../context/DateFormatterContext'

type PropsType = {| children: React.Node |}

export default ({ children }: PropsType) => {
  const [language, setLanguage] = useState<string>(config.defaultFallback)
  const [errorMessage, setErrorMessage] = useState<?string>(null)
  const [i18nextInstance, setI18nextInstance] = useState(null)

  const dispatch = useDispatch()
  const contentLanguage: ?string = useSelector((state: StateType) => state.location.payload.language)

  useEffect(() => {
    const initI18Next = async () => {
      const resources = loadTranslations(buildConfig().translationsOverride)
      const i18nextInstance = await i18next.createInstance().use(BrowserLanguageDetector)

      await i18nextInstance.init({
        resources,
        fallbackLng: {
          ...config.fallbacks,
          default: [config.defaultFallback]
        },
        supportedLngs: config.getSupportedLanguageTags(),
        load: 'all',
        interpolation: {
          escapeValue: false /* Escaping is not needed for react apps:
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

    // Only change ui direction from default ('ltr') if the language is supported
    if (config.isSupportedLanguage(language)) {
      dispatch(setUiDirection(config.hasRTLScript(language) ? 'rtl' : 'ltr'))
    }
  }, [dispatch, language])

  const additionalFont = config.getAdditionalFont(language)

  const dateFormatter = useMemo(() => new DateFormatter(config.defaultFallback), [])

  if (errorMessage) {
    return errorMessage
  }

  if (!i18nextInstance) {
    return null
  }

  return (
    <I18nextProvider i18n={i18nextInstance}>
      <div
        data-testid={'direction'}
        dir={config.isSupportedLanguage(language) ? (config.hasRTLScript(language) ? 'rtl' : 'ltr') : undefined}>
        <ReactHelmet>
          {additionalFont === 'lateef' && <link href='/fonts/lateef/lateef.css' rel='stylesheet' />}
          {additionalFont === 'noto-sans-sc' && <link href='/fonts/noto-sans-sc/noto-sans-sc.css' rel='stylesheet' />}
          <link href='/fonts/open-sans/open-sans.css' rel='stylesheet' />
          <link href='/fonts/raleway/raleway.css' rel='stylesheet' />
          <link href='/fonts/varela-round/varela-round.css' rel='stylesheet' />
        </ReactHelmet>
        <DateFormatterContext.Provider value={dateFormatter}>{children}</DateFormatterContext.Provider>
      </div>
    </I18nextProvider>
  )
}
