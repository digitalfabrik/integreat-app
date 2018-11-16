// @flow

import categoriesRoute, { getCategoriesPath } from '../categories'

describe('categories route', () => {
  it('should create the right path', () => {
    const city = 'augsburg'
    const language = 'de'
    expect(getCategoriesPath({city, language})).toBe('/augsburg/de')
  })

  it('should have the right path', () => {
    expect(categoriesRoute.path).toBe('/:city/:language/:categoryPath*')
  })
})
