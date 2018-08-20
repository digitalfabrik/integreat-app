// @flow

import languages from '../languages'
import LanguageModel from '../../models/LanguageModel'
import categories from '../categories'

jest.unmock('modules/endpoint/endpoints/languages')

describe('languages', () => {
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
    expect(languages.mapParamsToUrl(params)).toEqual(
      'https://cms.integreat-app.de/augsburg/de/wp-json/extensions/v3/languages'
    )
  })

  it('should throw if the city to map the url are missing', () => {
    expect(() => categories.mapParamsToUrl({city: undefined, language: 'de'})).toThrowErrorMatchingSnapshot()
  })

  it('should map fetched data to models', () => {
    const languageModels = languages.mapResponse(languagesJson, params)
    expect(languageModels).toEqual([
      new LanguageModel('de', 'Deutsch'),
      new LanguageModel('en', 'English')
    ])
  })
})
