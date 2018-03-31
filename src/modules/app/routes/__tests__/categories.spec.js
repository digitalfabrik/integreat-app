import { CATEGORIES_ROUTE, categoriesRoute, goToCategories } from '../categories'

describe('categories route', () => {
  it('should create the right action', () => {
    const city = 'augsburg'
    const language = 'de'
    const categoryPath = 'willkommen'
    expect(goToCategories(city, language, categoryPath)).toEqual({
      type: CATEGORIES_ROUTE,
      payload: {
        city,
        language,
        categoryPath
      }
    })
  })

  it('should have the right path', () => {
    expect(categoriesRoute.path).toBe('/:city/:language/:categoryPath*')
  })
})
