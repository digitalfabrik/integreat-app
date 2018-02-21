import setLanguageChangeUrls from '../setLanguageChangeUrls'
import setLanguageChangeUrlsAction from '../../actions/setLanguageChangeUrls'
import LanguageModel from '../../../endpoint/models/LanguageModel'

describe('setLanguageChangeUrls', () => {
  const mapper = (language, id) => `/${language}/${id}`
  const languages = [new LanguageModel('de', 'Deutsch'), new LanguageModel('en', 'English')]
  const languageChangeAction = setLanguageChangeUrlsAction(mapper, languages, {de: 1, en: 2})

  test('should return the initial state', () => {
    expect(setLanguageChangeUrls(undefined, languageChangeAction)).toEqual({
      de: '/de/1',
      en: '/en/2'
    })
  })

  it('should handle SET_LANGUAGE_CHANGE_URLS', () => {
    expect(setLanguageChangeUrls({de: '/de/3', ar: '/ar/2', en: '/en/1'}, languageChangeAction)).toEqual({
      de: '/de/1',
      en: '/en/2'
    })
  })
})
