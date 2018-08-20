// @flow

import { goToLanding, LANDING_ROUTE, landingRoute } from '../landing'

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
    expect(landingRoute.path).toBe('/landing/:language')
  })
})
