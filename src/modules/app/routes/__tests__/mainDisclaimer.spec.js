// @flow

import mainDisclaimerRoute, { getMainDisclaimerPath } from '../mainDisclaimer'

describe('mainDisclaimer route', () => {
  it('should create the right path', () => {
    expect(getMainDisclaimerPath()).toBe('/disclaimer')
  })

  it('should have the right path', () => {
    expect(mainDisclaimerRoute).toBe('/disclaimer')
  })
})
