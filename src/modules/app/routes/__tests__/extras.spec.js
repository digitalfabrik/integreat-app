// @flow

import extrasRoute from '../extras'

describe('extras route', () => {
  it('should create the right path', () => {
    const city = 'augsburg'
    const language = 'de'
    expect(extrasRoute.getRoutePath({city, language})).toBe('/augsburg/de/extras')
  })

  it('should have the right path', () => {
    expect(extrasRoute.route.path).toBe('/:city/:language/extras/:extraId?')
  })
})
