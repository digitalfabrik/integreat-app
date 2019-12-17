// @flow

import AsyncStorage from '@react-native-community/async-storage'
import { mapValues, toPairs } from 'lodash/object'
import { fromPairs } from 'lodash/array'

const CONTENT_LANGUAGE_KEY = 'CONTENT_LANGUAGE'
const SELECTED_CITY_KEY = 'SELECTED_CITY'
export const API_URL_OVERRIDE_KEY = 'API_URL_OVERRIDE'
const ASYNC_STORAGE_VERSION_KEY = 'ASYNC_STORAGE_VERSION'

export type SettingsType = {|
  errorTracking: boolean | null,
  allowPushNotifications: boolean | null,
  test: boolean | null
|}

const e2eSettings = {
  errorTracking: false,
  allowPushNotifications: false,
  test: false
}

export const defaultSettings: SettingsType = (__DEV__ || process.env.E2E_TEST_IDS) ? e2eSettings : {
  errorTracking: null,
  allowPushNotifications: null,
  test: false
}

class AppSettings {
  asyncStorage: AsyncStorage

  constructor (asyncStorage: AsyncStorage = AsyncStorage) {
    this.asyncStorage = asyncStorage
  }

  loadSettings = async (): Promise<SettingsType> => {
    const settingsKeys = Object.keys(defaultSettings)
    const settingsArray = await this.asyncStorage.multiGet(settingsKeys)
    return mapValues(fromPairs(settingsArray), (value, key) => {
      const parsed = JSON.parse(value)

      if (parsed === null) {
        // null means this setting does not exist
        return defaultSettings[key]
      }

      return parsed
    })
  }

  setSettings = async (settings: $Shape<SettingsType>) => {
    const settingsArray = toPairs(mapValues(settings, value => JSON.stringify(value)))
    await this.asyncStorage.multiSet(settingsArray)
  }

  setVersion = async (version: string) => {
    await this.asyncStorage.setItem(ASYNC_STORAGE_VERSION_KEY, version)
  }

  loadVersion = async (): Promise<?string> => {
    return this.asyncStorage.getItem(ASYNC_STORAGE_VERSION_KEY)
  }

  loadContentLanguage = async (): Promise<?string> => {
    return this.asyncStorage.getItem(CONTENT_LANGUAGE_KEY)
  }

  setContentLanguage = async (language: string) => {
    await this.asyncStorage.setItem(CONTENT_LANGUAGE_KEY, language)
  }

  loadSelectedCity = async (): Promise<?string> => {
    return this.asyncStorage.getItem(SELECTED_CITY_KEY)
  }

  setSelectedCity = async (city: string) => {
    await this.asyncStorage.setItem(SELECTED_CITY_KEY, city)
  }

  clearSelectedCity = async () => {
    await this.asyncStorage.removeItem(SELECTED_CITY_KEY)
  }

  setApiUrlOverride = async (apiUrl: string) => {
    await this.asyncStorage.setItem(API_URL_OVERRIDE_KEY, apiUrl)
  }

  loadApiUrlOverride = async (): Promise<?string> => {
    return this.asyncStorage.getItem(API_URL_OVERRIDE_KEY)
  }

  clearAppSettings = async () => {
    await this.asyncStorage.removeItem(CONTENT_LANGUAGE_KEY)
    await this.asyncStorage.removeItem(SELECTED_CITY_KEY)
    await this.asyncStorage.removeItem(ASYNC_STORAGE_VERSION_KEY)
    await this.asyncStorage.removeItem(API_URL_OVERRIDE_KEY)
  }
}

export default AppSettings
