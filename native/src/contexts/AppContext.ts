import { createContext } from 'react'

import { ChatRegionSettings, defaultSettings, SettingsType } from '../utils/AppSettings'

// To change the region or language code, the respective functions should be used
export type UpdateSettingsType = Partial<Omit<SettingsType, 'selectedCity' | 'contentLanguage'>>

export type AppContextType = {
  settings: SettingsType
  regionCode: string | null
  languageCode: string
  updateSettings: (settings: UpdateSettingsType | ((oldSettings: SettingsType) => UpdateSettingsType)) => void
  updateChatSettings: (settings: Partial<ChatRegionSettings>) => void
  changeRegionCode: (regionCode: string | null) => void
  changeLanguageCode: (languageCode: string) => void
}

export const AppContext = createContext<AppContextType>({
  settings: defaultSettings,
  regionCode: null,
  languageCode: '',
  updateSettings: () => undefined,
  updateChatSettings: () => undefined,
  changeRegionCode: () => undefined,
  changeLanguageCode: () => undefined,
})
