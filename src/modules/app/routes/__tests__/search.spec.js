// @flow

import searchRoute from '../search'

describe('search route', () => {
  it('should create the right path', () => {
    const city = 'augsburg'
    const language = 'de'
    expect(searchRoute.getRoutePath({city, language})).toBe('/augsburg/de/search')
  })

  it('should have the right path', () => {
    expect(searchRoute.route.path).toBe('/:city/:language/search')
  })
})
