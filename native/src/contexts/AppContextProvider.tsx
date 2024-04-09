import React, { createContext, ReactElement, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import buildConfig from '../constants/buildConfig'
import appSettings, { defaultSettings, SettingsType } from '../utils/AppSettings'
import dataContainer from '../utils/DefaultDataContainer'
import { subscribeNews, unsubscribeNews } from '../utils/PushNotificationsManager'
import { reportError } from '../utils/sentry'

// To change the city or language code, the respective functions should be used
export type UpdateSettingsType = Partial<Omit<SettingsType, 'selectedCity' | 'contentLanguage'>>

export type AppContextType = {
  settings: SettingsType
  cityCode: string | null
  languageCode: string
  updateSettings: (settings: UpdateSettingsType) => void
  changeCityCode: (cityCode: string | null) => void
  changeLanguageCode: (languageCode: string) => void
}

export const AppContext = createContext<AppContextType>({
  settings: defaultSettings,
  cityCode: null,
  languageCode: '',
  updateSettings: () => undefined,
  changeCityCode: () => undefined,
  changeLanguageCode: () => undefined,
})

type AppContextProviderProps = {
  children: ReactElement
}

const AppContextProvider = ({ children }: AppContextProviderProps): ReactElement | null => {
  const [settings, setSettings] = useState<SettingsType | null>(null)
  const cityCode = settings?.selectedCity
  const languageCode = settings?.contentLanguage
  const { i18n } = useTranslation()
  const uiLanguage = i18n.languages[0]

  useEffect(() => {
    appSettings.loadSettings().then(setSettings).catch(reportError)
  }, [])

  const updateSettings = useCallback((settings: Partial<SettingsType>) => {
    setSettings(oldSettings => (oldSettings ? { ...oldSettings, ...settings } : null))
    appSettings.setSettings(settings).catch(reportError)
  }, [])

  const changeCityCode = useCallback(
    (newCityCode: string | null): void => {
      updateSettings({ selectedCity: newCityCode })
      if (languageCode && cityCode) {
        unsubscribeNews(cityCode, languageCode).catch(reportError)
      }
      if (languageCode && newCityCode) {
        subscribeNews(newCityCode, languageCode).catch(reportError)
      }
    },
    [updateSettings, cityCode, languageCode],
  )

  const changeLanguageCode = useCallback(
    (newLanguageCode: string): void => {
      updateSettings({ contentLanguage: newLanguageCode })
      if (cityCode && languageCode) {
        unsubscribeNews(cityCode, languageCode).catch(reportError)
      }
      if (cityCode) {
        subscribeNews(cityCode, newLanguageCode).catch(reportError)
      }
    },
    [updateSettings, cityCode, languageCode],
  )

  useEffect(() => {
    if (cityCode) {
      dataContainer.storeLastUsage(cityCode).catch(reportError)
    }
  }, [cityCode])

  useEffect(() => {
    const { fixedCity } = buildConfig().featureFlags
    if (settings && cityCode !== fixedCity && fixedCity) {
      changeCityCode(fixedCity)
    }
  }, [settings, cityCode, changeCityCode])

  useEffect(() => {
    if (settings && !languageCode && uiLanguage) {
      changeLanguageCode(uiLanguage)
    }
  }, [settings, changeLanguageCode, languageCode, uiLanguage])

  const appContext = useMemo(
    () => ({ settings, cityCode, languageCode, updateSettings, changeCityCode, changeLanguageCode }),
    [settings, cityCode, languageCode, updateSettings, changeCityCode, changeLanguageCode],
  )

  return appContext.settings && appContext.languageCode !== null ? (
    // @ts-expect-error typescript complains about null value even though we check for null
    <AppContext.Provider value={appContext}>{children}</AppContext.Provider>
  ) : null
}

export default AppContextProvider
