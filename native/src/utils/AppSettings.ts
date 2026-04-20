import LegacyAsyncStorage, { AsyncStorage, createAsyncStorage } from '@react-native-async-storage/async-storage'
import { mapValues } from 'lodash'

import { ThemeKey } from 'build-configs/ThemeKey'
import { ExternalSourcePermissions } from 'shared'

export const ASYNC_STORAGE_VERSION = 2
export type SettingsType = {
  storageVersion: number | null
  contentLanguage: string | null
  selectedCity: string | null
  introShown: boolean | null
  errorTracking: boolean | null
  allowPushNotifications: boolean | null
  apiUrlOverride: string | null
  externalSourcePermissions: ExternalSourcePermissions
  selectedTheme: ThemeKey
}
export const defaultSettings: SettingsType = {
  storageVersion: null,
  contentLanguage: null,
  selectedCity: null,
  introShown: null,
  errorTracking: true,
  allowPushNotifications: true,
  apiUrlOverride: null,
  externalSourcePermissions: {},
  selectedTheme: 'light',
}
export const settingsStorage = createAsyncStorage('settings')

const migrateToV2 = async (): Promise<void> => {
  const currentVersion = await settingsStorage.getItem('storageVersion')
  if (currentVersion === JSON.stringify(ASYNC_STORAGE_VERSION)) {
    return
  }

  const keys = Object.keys(defaultSettings) as (keyof SettingsType)[]
  const values = await Promise.all(keys.map(key => LegacyAsyncStorage.getItem(key)))

  const settingsToCopy = keys.reduce<Record<string, string>>((settings, key, index) => {
    const value = values[index]
    if (value) {
      return { ...settings, [key]: value }
    }
    return settings
  }, {})

  await settingsStorage.setMany({ ...settingsToCopy, storageVersion: JSON.stringify(ASYNC_STORAGE_VERSION) })
}

class AppSettings {
  asyncStorage: AsyncStorage

  constructor(asyncStorage: AsyncStorage = settingsStorage) {
    this.asyncStorage = asyncStorage
  }

  loadSettings = async (): Promise<SettingsType> => {
    await migrateToV2()
    const settingsKeys = Object.keys(defaultSettings) as [keyof SettingsType]
    const settings = (await this.asyncStorage.getMany(settingsKeys)) as Record<keyof SettingsType, string | null>
    return mapValues(settings, (value: string | null, key) => {
      if (value === null) {
        // null means this setting does not exist
        return defaultSettings[key as keyof SettingsType]
      }

      return JSON.parse(value) ?? defaultSettings[key as keyof SettingsType]
    })
  }

  setSettings = async (settings: Partial<SettingsType>): Promise<void> => {
    const entries = mapValues(settings, value => JSON.stringify(value))
    await this.asyncStorage.setMany(entries)
  }
}

const appSettings = new AppSettings()

export default appSettings
