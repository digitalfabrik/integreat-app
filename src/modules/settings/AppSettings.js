// @flow

import { AsyncStorage } from 'react-native'
import { mapValues, toPairs } from 'lodash/object'
import { fromPairs } from 'lodash/array'

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

      return value
    })
  }

  async setSettings (settings: $Shape<SettingsType>) {
    const settingsArray = toPairs(mapValues(settings, value => JSON.stringify(value)))
    await this.asyncStorage.multiSet(settingsArray)
  }
}

export default AppSettings
