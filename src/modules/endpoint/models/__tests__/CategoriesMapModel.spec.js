import CategoriesMapModel from '../CategoriesMapModel'
import CategoryModel from '../CategoryModel'

describe('CategoriesMapModel', () => {
  const categories = [
    new CategoryModel({id: 0, url: '/augsburg/de', title: 'augsburg'}),
    new CategoryModel({id: 20, url: '/augsburg/de/willkommen', parentId: 0, parentUrl: '/augsburg/de', title: 'willkommen', order: 1}),
    new CategoryModel({id: 21, url: '/augsburg/de/erste-schritte', parentId: 0, parentUrl: '/augsburg/de', title: 'erste-schritte', order: 2}),
    new CategoryModel({id: 22, url: '/augsburg/de/erste-schritte/asylantrag', parentId: 21, parentUrl: '/augsburg/de/erste-schritte', title: 'asylantrag'})
  ]

  const categoriesMapModel = new CategoriesMapModel(categories)

  const category1 = categoriesMapModel.getCategoryByUrl('/augsburg/de/')
  const category2 = categoriesMapModel.getCategoryByUrl('/augsburg/de/willkommen')
  const category3 = categoriesMapModel.getCategoryByUrl('/augsburg/de/erste-schritte')
  const category4 = categoriesMapModel.getCategoryByUrl('/augsburg/de/erste-schritte/asylantrag')

  it('should get the right categories and normalize urls', () => {
    expect(category1).toEqual(categories[0])
    expect(category2).toEqual(categories[1])
    expect(category3).toEqual(categories[2])
    expect(category4).toEqual(categories[3])
    expect(categoriesMapModel.getCategoryByUrl('/test/url')).toBe(undefined)
  })

  it('should find category by id', () => {
    expect(categoriesMapModel.getCategoryById(category1.id)).toBe(category1)
  })

  it('should have the right parent attributes', () => {
    expect(category2.parentUrl).toBe(category1.url)
    expect(category3.parentUrl).toBe(category1.url)
    expect(category4.parentUrl).toBe(category3.url)
  })

  it('should return all (mediate) parents in right order', () => {
    expect(categoriesMapModel.getAncestors(category4)[0]).toEqual(category1)
    expect(categoriesMapModel.getAncestors(category4)[1]).toEqual(category3)
  })

  it('should return all immediate children in the right order', () => {
    expect(categoriesMapModel.getChildren(category1)[0]).toEqual(category2)
    expect(categoriesMapModel.getChildren(category1)[1]).toEqual(category3)
  })
})
