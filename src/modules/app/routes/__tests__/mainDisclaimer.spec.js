// @flow

import mainDisclaimerRoute from '../mainDisclaimer'

describe('mainDisclaimer route', () => {
  it('should create the right action', () => {
    expect(mainDisclaimerRoute.goToRoute()).toEqual({
      type: mainDisclaimerRoute.name
    })
  })

  it('should have the right path', () => {
    expect(mainDisclaimerRoute.route).toBe('/disclaimer')
  })
})
