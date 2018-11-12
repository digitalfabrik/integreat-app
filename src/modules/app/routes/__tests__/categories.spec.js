// @flow

import categoriesRoute from '../categories'

describe('categories route', () => {
  it('should create the right path', () => {
    const city = 'augsburg'
    const language = 'de'
    expect(categoriesRoute.getRoutePath({city, language})).toBe('/augsburg/de')
  })

  it('should have the right path', () => {
    expect(categoriesRoute.route.path).toBe('/:city/:language/:categoryPath*')
  })
})
