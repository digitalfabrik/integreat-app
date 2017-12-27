import CategoriesContainer from '../CategoriesContainer'
import CategoryModel from '../CategoryModel'

describe('CategoriesContainer', () => {
  const categories = [
    new CategoryModel({id: 0, url: '/augsburg/de'}),
    new CategoryModel({id: 20, url: '/augsburg/de/willkommen', parent: 0}),
    new CategoryModel({id: 21, url: '/augsburg/de/erste-schritte', parent: 0}),
    new CategoryModel({id: 22, url: '/augsburg/de/erste-schritte/asylantrag', parent: 21})
  ]

  const categoriesContainer = new CategoriesContainer(categories)

  const category1 = categoriesContainer.getCategoryByUrl('/augsburg/de/')
  const category2 = categoriesContainer.getCategoryByUrl('/augsburg/de/willkommen')
  const category3 = categoriesContainer.getCategoryByUrl('/augsburg/de/erste-schritte')
  const category4 = categoriesContainer.getCategoryByUrl('/augsburg/de/erste-schritte/asylantrag')

  test('should normalize urls', () => {
    expect(category1).not.toBe(undefined)
  })

  test('should find category by id', () => {
    expect(categoriesContainer.getCategoryById(category1.id)).toBe(category1)
  })

  test('should have the right parent attributes', () => {
    expect(category2.parent).toBe(category1.url)
    expect(category3.parent).toBe(category1.url)
    expect(category4.parent).toBe(category3.url)
  })

  test('should return all (mediate) parents in right order', () => {
    expect(categoriesContainer.getAncestors(category4)[0]).toEqual(category1)
    expect(categoriesContainer.getAncestors(category4)[1]).toEqual(category3)
  })

  test('should return all immediate children', () => {
    expect(categoriesContainer.getChildren(category1)).toContainEqual(category2)
    expect(categoriesContainer.getChildren(category1)).toContainEqual(category3)
  })
})
