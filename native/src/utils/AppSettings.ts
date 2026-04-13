import AsyncStorage, { createAsyncStorage } from '@react-native-async-storage/async-storage'
import { mapValues } from 'lodash'

import { ThemeKey } from 'build-configs/ThemeKey'
import { ExternalSourcePermissions } from 'shared'

import { MIGRATION_KEY } from '../constants'

export const ASYNC_STORAGE_VERSION = '1'
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

export const copySettingsFromV2ToV3 = async (): Promise<void> => {
  const alreadyCopied = await AsyncStorage.getItem(MIGRATION_KEY)
  if (alreadyCopied === 'true') {
    return
  }

  const keys = Object.keys(defaultSettings) as (keyof SettingsType)[]
  const values = await Promise.all(keys.map(key => AsyncStorage.getItem(key)))

  const settingsToCopy: Record<string, string> = {}
  keys.forEach((key, index) => {
    const value = values[index]
    if (value !== null && value !== undefined) {
      settingsToCopy[key] = value
    }
  })

  if (Object.keys(settingsToCopy).length > 0) {
    await settingsStorage.setMany(settingsToCopy)
  }

  await AsyncStorage.setItem(MIGRATION_KEY, 'true')
}

class AppSettings {
  asyncStorage: typeof settingsStorage

  constructor(asyncStorage: typeof settingsStorage = settingsStorage) {
    this.asyncStorage = asyncStorage
  }

  loadSettings = async (): Promise<SettingsType> => {
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
        return defaultSettings[key as keyof SettingsType]
      }

      return parsed
    })
  }

  setSettings = async (settings: Partial<SettingsType>): Promise<void> => {
    const entries = mapValues(settings, value => JSON.stringify(value)) as Record<string, string>
    await this.asyncStorage.setMany(entries)
  }
}

const appSettings = new AppSettings()

export default appSettings
