// @flow

import disclaimerRoute, { DISCLAIMER_ROUTE, goToDisclaimer } from '../disclaimer'

describe('disclaimer route', () => {
  it('should create the right action', () => {
    const city = 'augsburg'
    const language = 'de'
    expect(goToDisclaimer(city, language)).toEqual({
      type: DISCLAIMER_ROUTE,
      payload: {
        city,
        language
      }
    })
  })

  it('should have the right path', () => {
    expect(disclaimerRoute.route.path).toBe('/:city/:language/disclaimer')
  })
})
