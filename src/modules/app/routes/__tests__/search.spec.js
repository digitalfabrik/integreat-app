// @flow

import searchRoute from '../search'

describe('search route', () => {
  it('should create the right action', () => {
    const city = 'augsburg'
    const language = 'de'
    expect(searchRoute.goToRoute({city, language})).toEqual({
      type: searchRoute.name,
      payload: {
        city,
        language
      }
    })
  })

  it('should have the right path', () => {
    expect(searchRoute.route.path).toBe('/:city/:language/search')
  })
})
