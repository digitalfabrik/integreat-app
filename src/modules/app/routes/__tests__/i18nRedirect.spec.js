// @flow

import i18nRedirectRoute from '../i18nRedirect'

describe('i18nRedirect route', () => {
  it('should create the right path', () => {
    const param = 'param'
    expect(i18nRedirectRoute.getRoutePath({param})).toBe('/param')
  })

  it('should have the right path', () => {
    expect(i18nRedirectRoute.route.path).toBe('/:param?')
  })
})
