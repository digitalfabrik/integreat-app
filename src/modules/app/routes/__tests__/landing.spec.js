// @flow

import landingRoute from '../landing'

describe('landing route', () => {
  it('should create the right action', () => {
    const language = 'de'
    expect(landingRoute.goToRoute(language)).toEqual({
      type: landingRoute.name,
      payload: {
        language
      }
    })
  })

  it('should have the right path', () => {
    expect(landingRoute.route.path).toBe('/landing/:language')
  })
})
