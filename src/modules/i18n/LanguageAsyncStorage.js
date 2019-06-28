// @flow

import { AsyncStorage } from 'react-native'

const LANGUAGE_KEY = 'CONTENT_LANGUAGE'

class LanguageAsyncStorage {
  asyncStorage: AsyncStorage

  constructor (asyncStorage: AsyncStorage = AsyncStorage) {
    this.asyncStorage = asyncStorage
  }

  async loadLanguage (): Promise<?string> {
    return this.asyncStorage.getItem(LANGUAGE_KEY)
  }

  async setLanguage (language: string) {
    await this.asyncStorage.setItem(LANGUAGE_KEY, language)
  }
}

export default LanguageAsyncStorage
