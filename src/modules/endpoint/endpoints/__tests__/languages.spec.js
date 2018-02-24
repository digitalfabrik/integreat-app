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

  const state = {router: {params: {location: 'augsburg'}}}

  it('should map router to url', () => {
    expect(languages.mapStateToUrl(state)).toEqual(
      'https://cms.integreat-app.de/augsburg/de/wp-json/extensions/v0/languages/wpml'
    )
  })

  it('should map fetched data to models', () => {
    const languageModels = languages.mapResponse(languagesJson)
    expect(languageModels).toEqual([
      new LanguageModel('de', 'Deutsch'),
      new LanguageModel('en', 'English')
    ])
  })
})
