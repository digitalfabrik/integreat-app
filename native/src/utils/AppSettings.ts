import LegacyAsyncStorage, { AsyncStorage, createAsyncStorage } from '@react-native-async-storage/async-storage'
import { mapValues } from 'lodash'

import { ThemeKey } from 'build-configs/ThemeKey'
import { ExternalSourcePermissions } from 'shared'

export const ASYNC_STORAGE_VERSION = '2'
export type SettingsType = {
  storageVersion: string | null
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

class AppSettings {
  asyncStorage: AsyncStorage
  private migrated: Promise<void> | null = null

  constructor(asyncStorage: AsyncStorage = settingsStorage) {
    this.asyncStorage = asyncStorage
    this.migrated = this.migrateToV2()
  }

  private migrateToV2 = async (): Promise<void> => {
    const currentVersion = await this.asyncStorage.getItem('storageVersion')
    if (currentVersion === ASYNC_STORAGE_VERSION) {
      return
    }

    const keys = Object.keys(defaultSettings) as (keyof SettingsType)[]
    const values = await Promise.all(keys.map(key => LegacyAsyncStorage.getItem(key)))

    const settingsToCopy = keys.reduce<Record<string, string>>((settings, key, index) => {
      const value = values[index]
      if (value) {
        // eslint-disable-next-line no-param-reassign
        settings[key] = value
      }
      return settings
    }, {})

    await this.asyncStorage.setMany({ ...settingsToCopy, storageVersion: ASYNC_STORAGE_VERSION })
  }

  loadSettings = async (): Promise<SettingsType> => {
    await this.migrated
    const settingsKeys = Object.keys(defaultSettings) as [keyof SettingsType]
    const settings = (await this.asyncStorage.getMany(settingsKeys)) as Record<keyof SettingsType, string | null>
    return mapValues(settings, (value: string | null, key) => {
      if (value === null) {
        // null means this setting does not exist
        return defaultSettings[key as keyof SettingsType]
      }

      const parsed = JSON.parse(value)

      if (parsed === null) {
        // null means this setting does not exist
        return JSON.parse(value) ?? defaultSettings[key as keyof SettingsType]
      }

      return parsed
    })
  }

  setSettings = async (settings: Partial<SettingsType>): Promise<void> => {
    const entries = mapValues(settings, value => JSON.stringify(value))
    await this.asyncStorage.setMany(entries)
  }
}

const appSettings = new AppSettings()

export default appSettings
