// @flow

import LanguageDetector from '../LanguageDetector'

let mockGetLanguageCode
jest.mock('../../platform/getLanguageCode', () => {
  mockGetLanguageCode = jest.fn()
  return mockGetLanguageCode
})

describe('LanguageDetector', () => {
  it('should detect current language code', () => {
    mockGetLanguageCode.mockImplementation(() => 'en')
    expect(LanguageDetector.detect()).toBe('en')
  })

  it('should substring if language code is too long', () => {
    mockGetLanguageCode.mockImplementation(() => 'en_US')

    expect(LanguageDetector.detect()).toBe('en')
  })

  it('should not respond to language changes', () => {
    mockGetLanguageCode.mockImplementation(() => 'en')
    expect(LanguageDetector.detect()).toBe('en')
    LanguageDetector.cacheUserLanguage('de')
    expect(LanguageDetector.detect()).toBe('en')
  })
})
