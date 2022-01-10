import { getLocales } from 'react-native-localize'
import { mocked } from 'jest-mock'

import NativeLanguageDetector from '../NativeLanguageDetector'

jest.mock('react-native-localize')

describe('NativeLanguageDetector', () => {
  const enLocale = {
    languageCode: 'en',
    languageTag: 'en-US',
    countryCode: 'US',
    isRTL: false
  }
  const pesLocale = {
    languageCode: 'fa',
    languageTag: 'fa-IR',
    countryCode: 'IR',
    isRTL: true
  }
  const prsLocale = {
    languageCode: 'fa',
    languageTag: 'fa-AF',
    countryCode: 'AF',
    isRTL: true
  }
  const srLocale = {
    languageCode: 'sr',
    languageTag: 'sr-Cyrl',
    countryCode: 'Cyrl',
    isRTL: true
  }
  const unsupportedLocale = {
    languageCode: 'xx',
    languageTag: 'xx-YY',
    countryCode: 'YY',
    isRTL: true
  }

  it('should detect correctly if language tag is directly supported', () => {
    mocked(getLocales).mockImplementation(() => [srLocale, pesLocale])
    expect(NativeLanguageDetector.detect()).toStrictEqual('sr-Cyrl')
  })

  it('should detect correctly if language code is directly supported', () => {
    mocked(getLocales).mockImplementation(() => [enLocale, pesLocale])
    expect(NativeLanguageDetector.detect()).toStrictEqual('en')
  })

  it('should detect fallback if language tag is indirectly supported via fallback', () => {
    mocked(getLocales).mockImplementation(() => [prsLocale, enLocale, unsupportedLocale])
    expect(NativeLanguageDetector.detect()).toStrictEqual('prs')
  })

  it('should detect fallback if language code is indirectly supported via fallback', () => {
    mocked(getLocales).mockImplementation(() => [pesLocale, unsupportedLocale])
    expect(NativeLanguageDetector.detect()).toStrictEqual('pes')
  })

  it('should return first supported language', () => {
    mocked(getLocales).mockImplementation(() => [unsupportedLocale, unsupportedLocale, prsLocale, enLocale])
    expect(NativeLanguageDetector.detect()).toStrictEqual('prs')
  })

  it('should return fallback if no locale is supported', () => {
    mocked(getLocales).mockImplementation(() => [unsupportedLocale, unsupportedLocale])
    expect(NativeLanguageDetector.detect()).toStrictEqual('de')
  })

  it('should not respond to language changes', () => {
    mocked(getLocales).mockImplementation(() => [enLocale])
    expect(NativeLanguageDetector.detect()).toStrictEqual('en')
    NativeLanguageDetector.cacheUserLanguage('de')
    expect(NativeLanguageDetector.detect()).toStrictEqual('en')
  })
})
