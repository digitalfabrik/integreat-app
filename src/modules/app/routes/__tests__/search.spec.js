import { goToSearch, SEARCH_ROUTE, searchRoute } from '../search'

describe('search route', () => {
  it('should create the right action', () => {
    const city = 'augsburg'
    const language = 'de'
    expect(goToSearch(city, language)).toEqual({
      type: SEARCH_ROUTE,
      payload: {
        city,
        language
      }
    })
  })

  it('should have the right path', () => {
    expect(searchRoute.path).toBe('/:city/:language/search')
  })
})
