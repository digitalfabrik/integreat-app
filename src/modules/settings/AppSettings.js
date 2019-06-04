// @flow

import { AsyncStorage } from 'react-native'
import { mapValues, toPairs } from 'lodash/object'
import { fromPairs } from 'lodash/array'

export type SettingsType = {|
  errorTracking: boolean | null,
  test: boolean
|}

export const defaultSettings: SettingsType = {
  errorTracking: false,
  test: false
}

class AppSettings {
  asyncStorage: AsyncStorage

  constructor (asyncStorage: AsyncStorage = AsyncStorage) {
    this.asyncStorage = asyncStorage
  }

  async loadSettings (): Promise<SettingsType> {
    const settingsKeys = Object.keys(defaultSettings)
    const settingsArray = await AsyncStorage.multiGet(settingsKeys)
    return mapValues(fromPairs(settingsArray), value => JSON.parse(value))
  }

  async setSettings (settings: $Shape<SettingsType>) {
    const settingsArray = toPairs(mapValues(settings, value => JSON.stringify(value)))
    await AsyncStorage.multiSet(settingsArray)
  }
}

export default AppSettings
