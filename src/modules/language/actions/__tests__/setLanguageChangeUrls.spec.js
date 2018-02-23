import setLanguageChangeUrls from '../setLanguageChangeUrls'
import LanguageModel from '../../../endpoint/models/LanguageModel'

describe('setLanguageChangeUrls', () => {
  it('should create an action to change language urls', () => {
    const mapper = (language, id) => `/${language}/${id}`
    const languages = [new LanguageModel('de', 'Deutsch'), new LanguageModel('en', 'English')]
    const action = setLanguageChangeUrls(mapper, languages, {de: 1, en: 2})
    expect(action).toEqual({
      payload: {
        de: '/de/1',
        en: '/en/2'
      },
      type: 'SET_LANGUAGE_CHANGE_URLS'
    })
  })

  it('should create an action to change language urls if there are no available languages', () => {
    const mapper = (language) => `/${language}`
    const languages = [new LanguageModel('de', 'Deutsch'), new LanguageModel('en', 'English')]
    const action = setLanguageChangeUrls(mapper, languages, undefined)

    expect(action).toEqual({
      payload: {
        de: '/de',
        en: '/en'
      },
      type: 'SET_LANGUAGE_CHANGE_URLS'
    })
  })
})
