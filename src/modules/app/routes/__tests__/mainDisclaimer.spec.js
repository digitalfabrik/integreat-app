import { goToMainDisclaimer, MAIN_DISCLAIMER_ROUTE, mainDisclaimerRoute } from '../mainDisclaimer'

describe('mainDisclaimer route', () => {
  it('should create the right action', () => {
    expect(goToMainDisclaimer()).toEqual({
      type: MAIN_DISCLAIMER_ROUTE
    })
  })

  it('should have the right path', () => {
    expect(mainDisclaimerRoute).toBe('/disclaimer')
  })
})
