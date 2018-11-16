// @flow

import landingRoute, { getLandingPath } from '../landing'

describe('landing route', () => {
  it('should create the right path', () => {
    const language = 'de'
    expect(getLandingPath({language})).toBe('/landing/de')
  })

  it('should have the right path', () => {
    expect(landingRoute.path).toBe('/landing/:language')
  })
})
