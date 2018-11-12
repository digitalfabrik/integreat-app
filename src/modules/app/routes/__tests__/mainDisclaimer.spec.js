// @flow

import mainDisclaimerRoute from '../mainDisclaimer'

describe('mainDisclaimer route', () => {
  it('should create the right path', () => {
    expect(mainDisclaimerRoute.getRoutePath()).toBe('/disclaimer')
  })

  it('should have the right path', () => {
    expect(mainDisclaimerRoute.route).toBe('/disclaimer')
  })
})
