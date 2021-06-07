import NativeLanguageDetector from '../NativeLanguageDetector'
import { getLocales } from 'react-native-localize'

jest.mock('react-native-localize')

describe('NativeLanguageDetector', () => {
  const enLocale = {
    languageCode: 'en',
    languageTag: 'en-US'
  }

  it('should detect current language code', () => {
    // @ts-ignore
    getLocales.mockImplementation(() => [enLocale])
    expect(NativeLanguageDetector.detect()).toStrictEqual(['en-US'])
  })

  it('should not respond to language changes', () => {
    // @ts-ignore
    getLocales.mockImplementation(() => [enLocale])
    expect(NativeLanguageDetector.detect()).toStrictEqual(['en-US'])
    NativeLanguageDetector.cacheUserLanguage('de')
    expect(NativeLanguageDetector.detect()).toStrictEqual(['en-US'])
  })
})
