// @flow

import extrasRoute, { EXTRAS_ROUTE, goToExtras } from '../extras'

describe('extras route', () => {
  it('should create the right action', () => {
    const city = 'augsburg'
    const language = 'de'
    expect(goToExtras(city, language)).toEqual({
      type: EXTRAS_ROUTE,
      payload: {
        city,
        language
      }
    })
  })

  it('should have the right path', () => {
    expect(extrasRoute.route.path).toBe('/:city/:language/extras/:extraId?')
  })
})
