// @flow

import LanguageDetector from '../LanguageDetector'
import { getLocales } from 'react-native-localize'

jest.mock('react-native-localize')

describe('LanguageDetector', () => {
  it('should detect current language code', () => {
    getLocales.mockImplementation(() => ([{ languageCode: 'en' }]))
    expect(LanguageDetector.detect()).toBe('en')
  })

  it('should not respond to language changes', () => {
    getLocales.mockImplementation(() => ([{ languageCode: 'en' }]))
    expect(LanguageDetector.detect()).toBe('en')
    LanguageDetector.cacheUserLanguage('de')
    expect(LanguageDetector.detect()).toBe('en')
  })
})
