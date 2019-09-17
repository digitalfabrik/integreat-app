// @flow

import LanguageDetector from '../LanguageDetector'

let mockGetLocale
jest.mock('../../platform/getLocale', () => {
  mockGetLocale = jest.fn()
  return mockGetLocale
})

describe('LanguageDetector', () => {
  it('should detect current locale language', () => {
    mockGetLocale.mockImplementation(() => 'en')
    expect(LanguageDetector.detect()).toBe('en')
  })

  it('should substring if locale is too long', () => {
    mockGetLocale.mockImplementation(() => 'en_US')

    expect(LanguageDetector.detect()).toBe('en')
  })

  it('should not respond to language changes', () => {
    mockGetLocale.mockImplementation(() => 'en')
    expect(LanguageDetector.detect()).toBe('en')
    LanguageDetector.cacheUserLanguage('de')
    expect(LanguageDetector.detect()).toBe('en')
  })
})
