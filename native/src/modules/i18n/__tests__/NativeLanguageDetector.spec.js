// @flow

import NativeLanguageDetector from '../NativeLanguageDetector'
import { getLocales } from 'react-native-localize'

jest.mock('react-native-localize')

describe('NativeLanguageDetector', () => {
  it('should detect current language code', () => {
    getLocales.mockImplementation(() => ([{ languageCode: 'en' }]))
    expect(NativeLanguageDetector.detect()).toStrictEqual(['en'])
  })

  it('should not respond to language changes', () => {
    getLocales.mockImplementation(() => ([{ languageCode: 'en' }]))
    expect(NativeLanguageDetector.detect()).toStrictEqual(['en'])
    NativeLanguageDetector.cacheUserLanguage('de')
    expect(NativeLanguageDetector.detect()).toStrictEqual(['en'])
  })
})
