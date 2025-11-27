import { filterLanguageChangePath } from '../LanguageSelector'

describe('filterLanguageChangePath', () => {
  const languageChangePath = { code: 'en', path: '/augsburg/en/', name: 'English' }
  const languageNamesInGerman = new Intl.DisplayNames(['de'], { type: 'language' })
  const languageNamesInFrench = new Intl.DisplayNames(['fr'], { type: 'language' })

  it('should return true for an empty query', () => {
    const query = ''
    expect(filterLanguageChangePath(languageChangePath, query, languageNamesInGerman, languageNamesInGerman)).toBe(true)
  })

  it('should return true if the query matches the name in the language of the current languageChangePath', () => {
    const query = 'english'
    expect(filterLanguageChangePath(languageChangePath, query, languageNamesInGerman, languageNamesInGerman)).toBe(true)
  })

  it('should return true if the query matches the name in the current language', () => {
    const query = 'angl'
    expect(filterLanguageChangePath(languageChangePath, query, languageNamesInFrench, languageNamesInGerman)).toBe(true)
  })

  it('should return true if the query matches the name in the fallback language', () => {
    const query = 'englisch'
    expect(filterLanguageChangePath(languageChangePath, query, languageNamesInFrench, languageNamesInGerman)).toBe(true)
  })

  it('should return false if nothing matches', () => {
    const query = 'xyz'
    expect(filterLanguageChangePath(languageChangePath, query, languageNamesInGerman, languageNamesInGerman)).toBe(
      false,
    )
  })
})
