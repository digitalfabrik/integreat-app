// @flow

import LanguageModel from '../../models/LanguageModel'
import createTunewsLanguagesEndpoint from '../createTunewsLanguagesEndpoint'

describe('tunews language', () => {
  const baseUrl = 'https://cms-test.integreat-app.de'
  const tunewsElement = createTunewsLanguagesEndpoint(baseUrl)

  const languagesJson = [
    {
      code: 'en',
      name: 'English',
      direction: 'ltr'
    },
    {
      code: 'de',
      name: 'Deutsch',
      direction: 'ltr'
    }
  ]

  it('should map params to url', () => {
    expect(tunewsElement.mapParamsToUrl()).toEqual(
      `${baseUrl}/v1/news/languages`
    )
  })

  it('should map fetched data to models', () => {
    const languageModels = tunewsElement.mapResponse(languagesJson)
    expect(languageModels).toEqual([
      new LanguageModel('de', 'Deutsch', 'ltr'),
      new LanguageModel('en', 'English', 'ltr')
    ])
  })
})
