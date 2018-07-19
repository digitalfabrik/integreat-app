import { EXTRAS_ROUTE, extrasRoute, goToExtras } from '../extras'

describe('extras route', () => {
  it('should create the right action', () => {
    const city = 'augsburg'
    const language = 'de'
    const internalExtra = 'sprungbrett'
    expect(goToExtras(city, language, internalExtra)).toEqual({
      type: EXTRAS_ROUTE,
      payload: {
        city,
        language,
        internalExtra
      }
    })
  })

  it('should have the right path', () => {
    expect(extrasRoute.path).toBe('/:city/:language/extras/:internalExtra?')
  })
})
