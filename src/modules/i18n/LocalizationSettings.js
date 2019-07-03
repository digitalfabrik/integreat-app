// @flow

import { AsyncStorage } from 'react-native'

const LANGUAGE_KEY = 'CONTENT_LANGUAGE'
const SELECTED_CITY = 'SELECTED_CITY'

class LocalizationSettings {
  asyncStorage: AsyncStorage

  constructor (asyncStorage: AsyncStorage = AsyncStorage) {
    this.asyncStorage = asyncStorage
  }

  loadLanguage = (): Promise<?string> => {
    return this.asyncStorage.getItem(LANGUAGE_KEY)
  }

  setLanguage = async (language: string) => {
    await this.asyncStorage.setItem(LANGUAGE_KEY, language)
  }

  loadSelectedCity = (): Promise<?string> => {
    return this.asyncStorage.getItem(SELECTED_CITY)
  }

  setSelectedCity = async (city: ?string) => {
    await this.asyncStorage.setItem(SELECTED_CITY, city)
  }

  clearSelectedCity = async () => {
    await this.asyncStorage.removeItem(SELECTED_CITY)
  }
}

export default LocalizationSettings
