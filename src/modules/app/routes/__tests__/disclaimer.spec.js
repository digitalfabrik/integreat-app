// @flow

import disclaimerRoute, { getDisclaimerPath } from '../disclaimer'

describe('disclaimer route', () => {
  it('should create the right path', () => {
    const city = 'augsburg'
    const language = 'de'
    expect(getDisclaimerPath({city, language})).toBe('/augsburg/de/disclaimer')
  })

  it('should have the right path', () => {
    expect(disclaimerRoute.path).toBe('/:city/:language/disclaimer')
  })
})
