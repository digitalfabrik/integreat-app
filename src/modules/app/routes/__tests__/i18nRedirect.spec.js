import { goToI18nRedirect, I18N_REDIRECT_ROUTE, i18nRedirectRoute } from '../i18nRedirect'

describe('i18nRedirect route', () => {
  it('should create the right action', () => {
    const param = 'param'
    expect(goToI18nRedirect(param)).toEqual({
      type: I18N_REDIRECT_ROUTE,
      payload: {
        param
      }
    })
  })

  it('should have the right path', () => {
    expect(i18nRedirectRoute.path).toBe('/:param?')
  })
})
