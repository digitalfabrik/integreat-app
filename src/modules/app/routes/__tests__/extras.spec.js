import { EXTRAS_ROUTE, extrasRoute, goToExtras } from '../extras'

describe('extras route', () => {
  it('should create the right action', () => {
    const city = 'augsburg'
    const language = 'de'
    const extraAlias = 'sprungbrett'
    expect(goToExtras(city, language, extraAlias)).toEqual({
      type: EXTRAS_ROUTE,
      payload: {
        city,
        language,
        extraAlias
      }
    })
  })

  it('should have the right path', () => {
    expect(extrasRoute.path).toBe('/:city/:language/extras/:extraAlias?')
  })
})
