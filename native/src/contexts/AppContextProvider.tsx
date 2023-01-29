import React, { createContext, ReactElement, useCallback, useEffect, useMemo, useState } from 'react'

import { useLoadAsync } from 'api-client'

import appSettings from '../utils/AppSettings'
import dataContainer from '../utils/DefaultDataContainer'
import * as PushNotificationsManager from '../utils/PushNotificationsManager'
import { reportError } from '../utils/sentry'

type AppContextType = {
  cityCode: string | null
  changeCityCode: (cityCode: string) => void
  languageCode: string
  changeLanguageCode: (languageCode: string) => void
}
export const AppContext = createContext<AppContextType>({
  cityCode: null,
  changeCityCode: () => undefined,
  languageCode: '',
  changeLanguageCode: () => undefined,
})

type AppContextProviderProps = {
  children: ReactElement
}

const AppContextProvider = ({ children }: AppContextProviderProps): ReactElement | null => {
  const [cityCode, setCityCode] = useState<string | null>(null)
  const [languageCode, setLanguageCode] = useState<string | null>(null)

  const loadSettings = useCallback(async () => {
    const settings = await appSettings.loadSettings()
    const { selectedCity, contentLanguage } = settings
    if (!contentLanguage) {
      throw new Error('Language not initialized by I18nProvider!')
    }
    setCityCode(selectedCity)
    setLanguageCode(contentLanguage)
  }, [])

  useLoadAsync(loadSettings)

  useEffect(() => {
    if (cityCode) {
      dataContainer.storeLastUsage(cityCode).catch(reportError)
    }
  }, [cityCode])

  const subscribe = useCallback((cityCode: string, languageCode: string) => {
    PushNotificationsManager.requestPushNotificationPermission()
      .then(permissionGranted =>
        permissionGranted
          ? PushNotificationsManager.subscribeNews(cityCode, languageCode)
          : appSettings.setSettings({ allowPushNotifications: false })
      )
      .catch(reportError)
  }, [])

  const unsubscribe = useCallback(
    (cityCode: string, languageCode: string) =>
      PushNotificationsManager.unsubscribeNews(cityCode, languageCode).catch(reportError),
    []
  )

  const changeCityCode = useCallback(
    (newCityCode: string): void => {
      setCityCode(newCityCode)
      appSettings.setSelectedCity(newCityCode).catch(reportError)
      if (languageCode && cityCode) {
        unsubscribe(cityCode, languageCode)
      }
      if (languageCode) {
        subscribe(newCityCode, languageCode)
      }
    },
    [cityCode, languageCode, subscribe, unsubscribe]
  )

  const changeLanguageCode = useCallback(
    (newLanguageCode: string): void => {
      setLanguageCode(newLanguageCode)
      appSettings.setContentLanguage(newLanguageCode).catch(reportError)
      if (cityCode && languageCode) {
        unsubscribe(cityCode, languageCode)
      }
      if (cityCode) {
        subscribe(cityCode, newLanguageCode)
      }
    },
    [cityCode, languageCode, subscribe, unsubscribe]
  )

  const appContext = useMemo(
    () => ({ cityCode, changeCityCode, languageCode, changeLanguageCode }),
    [cityCode, changeCityCode, languageCode, changeLanguageCode]
  )

  return appContext.languageCode !== null ? (
    // @ts-expect-error typescript complains about null value even though we check for null
    <AppContext.Provider value={appContext}>{children}</AppContext.Provider>
  ) : null
}

export default AppContextProvider
