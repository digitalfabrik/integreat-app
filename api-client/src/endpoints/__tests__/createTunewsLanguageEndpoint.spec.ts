import LanguageModel from '../../models/LanguageModel'
import createTunewsLanguagesEndpoint from '../createTunewsLanguagesEndpoint'
describe('tunews language', () => {
  const baseUrl = 'https://cms-test.integreat-app.de'
  const tunewsElement = createTunewsLanguagesEndpoint(baseUrl)
  const languagesJson = [
    {
      code: 'en',
      name: 'English'
    },
    {
      code: 'de',
      name: 'Deutsch'
    },
    {
      code: 'ar',
      name: '\u0627\u0644\u0639\u0631\u0628\u064a\u0629'
    }
  ]
  it('should map params to url', () => {
    expect(tunewsElement.mapParamsToUrl(undefined)).toEqual(`${baseUrl}/v1/news/languages`)
  })
  it('should map fetched data to models', () => {
    const languageModels = tunewsElement.mapResponse(languagesJson, undefined)
    expect(languageModels).toEqual([
      new LanguageModel('ar', '\u0627\u0644\u0639\u0631\u0628\u064a\u0629', undefined),
      new LanguageModel('de', 'Deutsch', undefined),
      new LanguageModel('en', 'English', undefined)
    ])
  })
})
