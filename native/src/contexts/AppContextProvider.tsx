import React, { createContext, ReactElement, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { hasProp } from 'shared'

import buildConfig from '../constants/buildConfig'
import appSettings, { defaultSettings, SettingsType } from '../utils/AppSettings'
import dataContainer from '../utils/DefaultDataContainer'
import { subscribeNews, unsubscribeNews } from '../utils/PushNotificationsManager'
import { reportError } from '../utils/sentry'

// To change the region or language code, the respective functions should be used
export type UpdateSettingsType = Partial<Omit<SettingsType, 'selectedCity' | 'contentLanguage'>>

export type AppContextType = {
  settings: SettingsType
  regionCode: string | null
  languageCode: string
  updateSettings: (settings: UpdateSettingsType) => void
  changeRegionCode: (regionCode: string | null) => void
  changeLanguageCode: (languageCode: string) => void
}

export const AppContext = createContext<AppContextType>({
  settings: defaultSettings,
  regionCode: null,
  languageCode: '',
  updateSettings: () => undefined,
  changeRegionCode: () => undefined,
  changeLanguageCode: () => undefined,
})

type AppContextProviderProps = {
  children: ReactElement
}

const AppContextProvider = ({ children }: AppContextProviderProps): ReactElement | null => {
  const [settings, setSettings] = useState<SettingsType | null>(null)
  const allowPushNotifications = !!settings?.allowPushNotifications
  const regionCode = settings?.selectedCity ?? null
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

  const changeRegionCode = useCallback(
    (newRegionCode: string | null): void => {
      updateSettings({ selectedCity: newRegionCode })
      if (languageCode && regionCode) {
        unsubscribeNews(regionCode, languageCode).catch(reportError)
      }
      if (languageCode && newRegionCode) {
        subscribeNews({ regionCode: newRegionCode, languageCode, allowPushNotifications }).catch(reportError)
      }
    },
    [updateSettings, regionCode, languageCode, allowPushNotifications],
  )

  const changeLanguageCode = useCallback(
    (newLanguageCode: string): void => {
      updateSettings({ contentLanguage: newLanguageCode })
      if (regionCode && languageCode) {
        unsubscribeNews(regionCode, languageCode).catch(reportError)
      }
      if (regionCode) {
        subscribeNews({ regionCode, languageCode: newLanguageCode, allowPushNotifications }).catch(reportError)
      }
    },
    [updateSettings, regionCode, languageCode, allowPushNotifications],
  )

  useEffect(() => {
    if (regionCode) {
      dataContainer.storeLastUsage(regionCode).catch(reportError)
    }
  }, [regionCode])

  useEffect(() => {
    const { fixedRegion } = buildConfig().featureFlags
    if (settings && regionCode !== fixedRegion && fixedRegion) {
      changeRegionCode(fixedRegion)
    }
  }, [settings, regionCode, changeRegionCode])

  useEffect(() => {
    if (settings && !languageCode && uiLanguage) {
      changeLanguageCode(uiLanguage)
    }
  }, [settings, changeLanguageCode, languageCode, uiLanguage])

  const appContext = useMemo(
    () => ({ settings, regionCode, languageCode, updateSettings, changeRegionCode, changeLanguageCode }),
    [settings, regionCode, languageCode, updateSettings, changeRegionCode, changeLanguageCode],
  )

  return hasProp(appContext, 'settings') && hasProp(appContext, 'languageCode') ? (
    <AppContext.Provider value={appContext}>{children}</AppContext.Provider>
  ) : null
}

export default AppContextProvider
