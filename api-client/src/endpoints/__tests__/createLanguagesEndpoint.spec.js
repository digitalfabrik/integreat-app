// @flow

import createLanguagesEndpoint from '../createLanguagesEndpoint'
import LanguageModel from '../../models/LanguageModel'

describe('languages', () => {
  const baseUrl = 'https://integreat-api-url.de'
  const languages = createLanguagesEndpoint(baseUrl)

  const languagesJson = [
    {
      code: 'en',
      native_name: 'English',
      dir: 'ltr'
    },
    {
      code: 'de',
      native_name: 'Deutsch',
      dir: 'ltr'
    },
    {
      code: 'ar',
      native_name: '\u0627\u0644\u0639\u0631\u0628\u064a\u0629',
      dir: 'rtl'
    }
  ]

  const params = {city: 'augsburg'}

  it('should map router to url', () => {
    expect(languages.mapParamsToUrl(params)).toEqual(
      'https://integreat-api-url.de/augsburg/de/wp-json/extensions/v3/languages'
    )
  })

  it('should throw if the city to map the url are missing', () => {
    expect(() => languages.mapParamsToUrl({city: undefined, language: 'de'})).toThrowErrorMatchingSnapshot()
  })

  it('should map fetched data to models', () => {
    const languageModels = languages.mapResponse(languagesJson, params)
    expect(languageModels).toEqual([
      new LanguageModel('ar', '\u0627\u0644\u0639\u0631\u0628\u064a\u0629', 'rtl'),
      new LanguageModel('de', 'Deutsch', 'ltr'),
      new LanguageModel('en', 'English', 'ltr')
    ])
  })
})
