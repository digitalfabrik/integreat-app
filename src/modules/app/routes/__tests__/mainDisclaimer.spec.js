// @flow

import mainDisclaimerRoute, { goToMainDisclaimer, MAIN_DISCLAIMER_ROUTE } from '../mainDisclaimer'

describe('mainDisclaimer route', () => {
  it('should create the right action', () => {
    expect(goToMainDisclaimer()).toEqual({
      type: MAIN_DISCLAIMER_ROUTE
    })
  })

  it('should have the right path', () => {
    expect(mainDisclaimerRoute.route).toBe('/disclaimer')
  })
})
