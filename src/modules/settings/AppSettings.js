// @flow

import { AsyncStorage } from 'react-native'
import { mapValues, toPairs } from 'lodash/object'
import { fromPairs } from 'lodash/array'

const CONTENT_LANGUAGE_KEY = 'CONTENT_LANGUAGE'
const SELECTED_CITY_KEY = 'SELECTED_CITY'

export type SettingsType = {|
  errorTracking: boolean | null,
  test: boolean | null
|}

const e2eSettings = {
  errorTracking: false,
  test: false
}

export const defaultSettings: SettingsType = (__DEV__ || process.env.E2E_TEST_IDS) ? e2eSettings : {
  errorTracking: null,
  test: false
}

class AppSettings {
  asyncStorage: AsyncStorage

  constructor (asyncStorage: AsyncStorage = AsyncStorage) {
    this.asyncStorage = asyncStorage
  }

  async loadSettings (): Promise<SettingsType> {
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

  async setSettings (settings: $Shape<SettingsType>) {
    const settingsArray = toPairs(mapValues(settings, value => JSON.stringify(value)))
    await this.asyncStorage.multiSet(settingsArray)
  }

  loadContentLanguage = (): Promise<?string> => {
    return this.asyncStorage.getItem(CONTENT_LANGUAGE_KEY)
  }

  setContentLanguage = async (language: string) => {
    await this.asyncStorage.setItem(CONTENT_LANGUAGE_KEY, language)
  }

  loadSelectedCity = (): Promise<?string> => {
    return this.asyncStorage.getItem(SELECTED_CITY_KEY)
  }

  setSelectedCity = async (city: ?string) => {
    await this.asyncStorage.setItem(SELECTED_CITY_KEY, city)
  }

  clearSelectedCity = async () => {
    await this.asyncStorage.removeItem(SELECTED_CITY_KEY)
  }
}

export default AppSettings
