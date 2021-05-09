// @flow

import isPeekingRoute from '../isPeekingRoute'

describe('isPeekingRoute', () => {
  it('should return false if new city is equal to city', () => {
    expect(
      isPeekingRoute(
        {
          darkMode: false,
          resourceCacheUrl: 'http://localhost:8080',
          cityContent: {
            city: 'augsburg',
            switchingLanguage: false,
            languages: { status: 'ready', models: [] },
            routeMapping: {},
            resourceCache: { status: 'ready', progress: 1, value: {} },
            searchRoute: null
          },
          contentLanguage: 'en',
          cities: {
            status: 'loading'
          },
          snackbar: []
        },
        { routeCity: 'augsburg' }
      )
    ).toBe(false)
  })

  it('should return true if new city is not equal to city', () => {
    expect(
      isPeekingRoute(
        {
          darkMode: false,
          resourceCacheUrl: 'http://localhost:8080',
          cityContent: {
            city: 'augsburg',
            switchingLanguage: false,
            languages: { status: 'ready', models: [] },
            routeMapping: {},
            resourceCache: { status: 'ready', progress: 1, value: {} },
            searchRoute: null
          },
          contentLanguage: 'en',
          cities: {
            status: 'loading'
          },
          snackbar: []
        },
        { routeCity: 'nuernberg' }
      )
    ).toBe(true)
  })

  it('should return false if there is no content', () => {
    expect(
      isPeekingRoute(
        {
          darkMode: false,
          resourceCacheUrl: 'http://localhost:8080',
          cityContent: null,
          contentLanguage: 'en',
          cities: {
            status: 'loading'
          },
          snackbar: []
        },
        { routeCity: 'augsburg' }
      )
    ).toBe(false)
  })
})
