// @flow

import landingRoute, { goToLanding, LANDING_ROUTE } from '../landing'

describe('landing route', () => {
  it('should create the right action', () => {
    const language = 'de'
    expect(goToLanding(language)).toEqual({
      type: LANDING_ROUTE,
      payload: {
        language
      }
    })
  })

  it('should have the right path', () => {
    expect(landingRoute.route.path).toBe('/landing/:language')
  })
})
