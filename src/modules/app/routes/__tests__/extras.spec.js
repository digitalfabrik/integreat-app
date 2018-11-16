// @flow

import extrasRoute, { getExtrasPath } from '../extras'

describe('extras route', () => {
  it('should create the right path', () => {
    const city = 'augsburg'
    const language = 'de'
    expect(getExtrasPath({city, language})).toBe('/augsburg/de/extras')
  })

  it('should have the right path', () => {
    expect(extrasRoute.path).toBe('/:city/:language/extras/:extraId?')
  })
})
