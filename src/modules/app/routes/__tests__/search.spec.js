// @flow

import searchRoute, { getSearchPath } from '../search'

describe('search route', () => {
  it('should create the right path', () => {
    const city = 'augsburg'
    const language = 'de'
    expect(getSearchPath({city, language})).toBe('/augsburg/de/search')
  })

  it('should have the right path', () => {
    expect(searchRoute.path).toBe('/:city/:language/search')
  })
})
