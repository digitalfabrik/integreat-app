// @flow

import i18nRedirectRoute, { getI18nRedirectPath } from '../i18nRedirect'

describe('i18nRedirect route', () => {
  it('should create the right path', () => {
    const param = 'param'
    expect(getI18nRedirectPath({param})).toBe('/param')
  })

  it('should have the right path', () => {
    expect(i18nRedirectRoute.path).toBe('/:param?')
  })
})
