import LanguageModel from '../../models/LanguageModel'
import createTuNewsLanguagesEndpoint from '../createTuNewsLanguagesEndpoint'

describe('tuNews language', () => {
  const baseUrl = 'https://cms-test.integreat-app.de'
  const tuNewsElement = createTuNewsLanguagesEndpoint(baseUrl)
  const languagesJson = [
    {
      code: 'en',
      name: 'English',
    },
    {
      code: 'de',
      name: 'Deutsch',
    },
    {
      code: 'ar',
      name: '\u0627\u0644\u0639\u0631\u0628\u064a\u0629',
    },
  ]
  it('should map params to url', () => {
    expect(tuNewsElement.mapParamsToUrl(undefined)).toBe(`${baseUrl}/v1/news/languages`)
  })
  it('should map fetched data to models', () => {
    const languageModels = tuNewsElement.mapResponse(languagesJson, undefined)
    expect(languageModels).toEqual([
      new LanguageModel('ar', '\u0627\u0644\u0639\u0631\u0628\u064a\u0629'),
      new LanguageModel('de', 'Deutsch'),
      new LanguageModel('en', 'English'),
    ])
  })
})
