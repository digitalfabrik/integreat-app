import { CATEGORIES_REDIRECT_ROUTE, categoriesRedirectRoute, goToCategoriesRedirect } from '../categoriesRedirect'

describe('categoriesRedirect route', () => {
  it('should create the right action', () => {
    const city = 'augsburg'
    const language = 'de'
    const categoryId = '1234'
    expect(goToCategoriesRedirect(city, language, categoryId)).toEqual({
      type: CATEGORIES_REDIRECT_ROUTE,
      payload: {
        city,
        language,
        categoryId
      }
    })
  })

  it('should have the right path', () => {
    expect(categoriesRedirectRoute.path).toBe('/:city/:language/redirect/:categoryId')
  })
})
