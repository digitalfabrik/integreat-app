// @flow

import languages from '../languages'
import LanguageModel from '../../models/LanguageModel'

jest.unmock('../languages')

describe('languages', () => {
  const apiUrl = 'https://integreat-api-url.de'

  const languagesJson = [
    {
      code: 'en',
      native_name: 'English'
    },
    {
      code: 'de',
      native_name: 'Deutsch'
    }
  ]

  const params = {city: 'augsburg'}

  it('should map router to url', () => {
    expect(languages.mapParamsToUrl(apiUrl, params)).toEqual(
      'https://integreat-api-url.de/augsburg/de/wp-json/extensions/v3/languages'
    )
  })

  it('should throw if the city to map the url are missing', () => {
    expect(() => languages.mapParamsToUrl(apiUrl, {city: undefined, language: 'de'})).toThrowErrorMatchingSnapshot()
  })

  it('should map fetched data to models', () => {
    const languageModels = languages.mapResponse(languagesJson, params)
    expect(languageModels).toEqual([
      new LanguageModel('de', 'Deutsch'),
      new LanguageModel('en', 'English')
    ])
  })
})
