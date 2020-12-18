// @flow

import * as React from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import MomentContext, { createMomentFormatter } from '../context/MomentContext'
import { Text } from 'react-native'
import buildConfig from '../../app/constants/buildConfig'
import { config, loadTranslations } from 'translations'
import i18next from 'i18next'
import { useDispatch } from 'react-redux'
import type { SetContentLanguageActionType } from '../../app/StoreActionType'
import NativeLanguageDetector from '../NativeLanguageDetector'
import AppSettings from '../../settings/AppSettings'

type PropsType = {| children: React.Node |}

export default ({ children }: PropsType) => {
  const [errorMessage, setErrorMessage] = useState<?string>(null)
  const [i18nextInstance, setI18nextInstance] = useState(null)
  const dispatch = useDispatch()

  const setContentLanguage = useCallback(async (uiLanguage: string) => {
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
  }, [dispatch])

  useEffect(() => {
    const initI18Next = async () => {
      const resources = loadTranslations(buildConfig().translationsOverride)
      const i18nextInstance = await i18next
        .createInstance()
        .use(NativeLanguageDetector)

      await i18nextInstance.init({
        resources,
        fallbackLng: {
          ...config.fallbacks,
          default: [config.defaultFallback]
        },
        load: 'languageOnly',
        interpolation: {
          escapeValue: false /* Escaping is not needed for react apps:
                                https://github.com/i18next/react-i18next/issues/277 */
        },
        debug: buildConfig().featureFlags.developerFriendly
      })

      setI18nextInstance(i18nextInstance)

      // Apply ui language as language
      i18nextInstance.on('languageChanged', uiLanguage => {
        setContentLanguage(uiLanguage).catch(e => {
          console.error(e)
        })
      })
    }

    initI18Next().catch((e: Error) => {
      setErrorMessage(e.message)
      console.error(e)
    })
  }, [setContentLanguage])

  const momentFormatter = useMemo(
    () => createMomentFormatter(() => undefined, () => config.defaultFallback),
    [])

  if (errorMessage) {
    return <Text>{errorMessage}</Text>
  }

  if (!i18nextInstance) {
    return null
  }

  return (
    <I18nextProvider i18n={i18nextInstance}>
      <MomentContext.Provider value={momentFormatter}>
        {children}
      </MomentContext.Provider>
    </I18nextProvider>
  )
}
