import NativeLanguageDetector from '../NativeLanguageDetector'
import { getLocales } from 'react-native-localize'
import { mocked } from 'ts-jest/utils'

jest.mock('react-native-localize')

describe('NativeLanguageDetector', () => {
  const enLocale = {
    languageCode: 'en',
    languageTag: 'en-US',
    countryCode: 'US',
    isRTL: false
  }

  it('should detect current language code', () => {
    mocked(getLocales).mockImplementation(() => [enLocale])
    expect(NativeLanguageDetector.detect()).toStrictEqual(['en-US'])
  })

  it('should not respond to language changes', () => {
    mocked(getLocales).mockImplementation(() => [enLocale])
    expect(NativeLanguageDetector.detect()).toStrictEqual(['en-US'])
    NativeLanguageDetector.cacheUserLanguage('de')
    expect(NativeLanguageDetector.detect()).toStrictEqual(['en-US'])
  })
})
