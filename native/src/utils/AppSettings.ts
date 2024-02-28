import AsyncStorage from '@react-native-async-storage/async-storage'
import { fromPairs, mapValues, toPairs } from 'lodash'

import { SignalType, ExternalSourcePermissions } from 'shared'

export const ASYNC_STORAGE_VERSION = '1'
export type SettingsType = {
  storageVersion: string | null
  contentLanguage: string | null
  selectedCity: string | null
  introShown: boolean | null
  errorTracking: boolean | null
  allowPushNotifications: boolean | null
  apiUrlOverride: string | null
  jpalTrackingEnabled: boolean | null
  jpalTrackingCode: string | null
  jpalSignals: Array<SignalType>
  externalSourcePermissions: ExternalSourcePermissions
}
export const defaultSettings: SettingsType = {
  storageVersion: null,
  contentLanguage: null,
  selectedCity: null,
  introShown: null,
  errorTracking: true,
  allowPushNotifications: true,
  apiUrlOverride: null,
  jpalTrackingEnabled: null,
  jpalTrackingCode: null,
  jpalSignals: [],
  externalSourcePermissions: {},
}

class AppSettings {
  asyncStorage: typeof AsyncStorage

  constructor(asyncStorage: typeof AsyncStorage = AsyncStorage) {
    this.asyncStorage = asyncStorage
  }

  loadSettings = async (): Promise<SettingsType> => {
    const settingsKeys = Object.keys(defaultSettings) as [keyof SettingsType]
    const settingsArray = await this.asyncStorage.multiGet(settingsKeys)
    const settings = fromPairs(settingsArray) as Record<keyof SettingsType, string | null>
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
    const settingsArray = toPairs<string>(mapValues(settings, value => JSON.stringify(value)))
    await this.asyncStorage.multiSet(settingsArray)
  }

  setExternalSourcePermissions = async (permissions: ExternalSourcePermissions): Promise<void> => {
    await this.setSettings({
      externalSourcePermissions: permissions,
    })
  }

  loadExternalSourcePermissions = async (): Promise<ExternalSourcePermissions> => {
    const settings = await this.loadSettings()
    return settings.externalSourcePermissions
  }

  setContentLanguage = async (language: string): Promise<void> => {
    await this.setSettings({
      contentLanguage: language,
    })
  }

  loadContentLanguage = async (): Promise<string | null> => {
    const settings = await this.loadSettings()
    return settings.contentLanguage
  }

  setJpalTrackingCode = async (jpalTrackingCode: string | null): Promise<void> => {
    await this.setSettings({
      jpalTrackingCode,
    })
  }

  setJpalTrackingEnabled = async (jpalTrackingEnabled: boolean): Promise<void> => {
    await this.setSettings({
      jpalTrackingEnabled,
    })
  }

  pushJpalSignal = async (signal: SignalType): Promise<void> => {
    const { jpalSignals } = await this.loadSettings()
    jpalSignals.push(signal)
    await this.setSettings({
      jpalSignals,
    })
  }

  clearJpalSignals = async (): Promise<Array<SignalType>> => {
    const { jpalSignals } = await this.loadSettings()
    await this.setSettings({
      jpalSignals: [],
    })
    return jpalSignals
  }

  setIntroShown = async (): Promise<void> => {
    await this.setSettings({
      introShown: true,
    })
  }

  setApiUrlOverride = async (apiUrlOverride: string): Promise<void> => {
    await this.setSettings({
      apiUrlOverride,
    })
  }

  loadApiUrlOverride = async (): Promise<string | null> => {
    const settings = await this.loadSettings()
    return settings.apiUrlOverride
  }

  clearAppSettings = async (): Promise<void> => {
    const settingsKeys = Object.keys(defaultSettings)
    await this.asyncStorage.multiRemove(settingsKeys)
  }
}

const appSettings = new AppSettings()

export default appSettings
