// @flow

import isPeekingRoute from '../isPeekingRoute'

describe('isPeekingRoute', () => {
  it('should return true if new city is equal to content city', () => {
    expect(isPeekingRoute({
      darkMode: false,
      cityContent: {
        city: 'augsburg',
        switchingLanguage: false,
        languages: [],
        categoriesRouteMapping: {},
        eventsRouteMapping: {},
        resourceCache: {},
        searchRoute: null
      },
      contentLanguage: 'en',
      cities: {
        status: 'loading'
      }
    }, { routeCity: 'augsburg' })).toBe(false)
  })

  it('should return false if there is no content', () => {
    expect(isPeekingRoute({
      darkMode: false,
      cityContent: null,
      contentLanguage: 'en',
      cities: {
        status: 'loading'
      }
    }, { routeCity: 'augsburg' })).toBe(false)
  })
})
