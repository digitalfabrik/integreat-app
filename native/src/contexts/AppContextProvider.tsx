import React, { createContext, ReactElement, useCallback, useEffect, useMemo, useState } from 'react'

import { useLoadAsync } from 'api-client'

import useSubscribePushNotifications from '../hooks/useSubscribePushNotifications'
import LoadingErrorHandler from '../routes/LoadingErrorHandler'
import appSettings from '../utils/AppSettings'
import dataContainer from '../utils/DefaultDataContainer'
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

const AppContextProvider = ({ children }: AppContextProviderProps): ReactElement => {
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
    return settings
  }, [])

  const settingsResponse = useLoadAsync(loadSettings)
  const allowPushNotifications = settingsResponse.data?.allowPushNotifications ?? null

  useEffect(() => {
    if (cityCode) {
      dataContainer.storeLastUsage(cityCode).catch(reportError)
    }
  }, [cityCode])

  useSubscribePushNotifications({ cityCode, languageCode, allowPushNotifications })

  const changeCityCode = useCallback((cityCode: string): void => {
    setCityCode(cityCode)
    appSettings.setSelectedCity(cityCode).catch(reportError)
  }, [])

  const changeLanguageCode = useCallback((languageCode: string): void => {
    setLanguageCode(languageCode)
    appSettings.setContentLanguage(languageCode).catch(reportError)
  }, [])

  const appContext = useMemo(
    () => ({ cityCode, changeCityCode, languageCode, changeLanguageCode }),
    [cityCode, changeCityCode, languageCode, changeLanguageCode]
  )

  return (
    <LoadingErrorHandler {...settingsResponse}>
      {/* @ts-expect-error typescript complains about null value even though we check for null */}
      {appContext.languageCode !== null && <AppContext.Provider value={appContext}>{children}</AppContext.Provider>}
    </LoadingErrorHandler>
  )
}

export default AppContextProvider
