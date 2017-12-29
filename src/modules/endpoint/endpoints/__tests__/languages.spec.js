import languages from '../languages'
import LanguageModel from '../../models/LanguageModel'

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

  test('should map state to urls', () => {
    expect(languages.mapStateToUrlParams({router: {params: {location: 'augsburg'}}}))
      .toEqual({location: 'augsburg', language: 'de'})
  })

  test('should map fetched data to models', () => {
    const languageModels = languages.mapResponse(languagesJson)
    expect(languageModels).toEqual([
      new LanguageModel('de', 'Deutsch'),
      new LanguageModel('en', 'English')
    ])
  })
})
