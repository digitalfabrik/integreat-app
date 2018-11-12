// @flow

import landingRoute from '../landing'

describe('landing route', () => {
  it('should create the right path', () => {
    const language = 'de'
    expect(landingRoute.getRoutePath({language})).toBe('/landing/de')
  })

  it('should have the right path', () => {
    expect(landingRoute.route.path).toBe('/landing/:language')
  })
})
