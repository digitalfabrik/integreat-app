// @flow

import CategoriesMapModel from '../CategoriesMapModel'
import CategoryModel from '../CategoryModel'
import moment from 'moment'

describe('CategoriesMapModel', () => {
  const farsiCategory = new CategoryModel({
    root: false,
    path: '/augsburg/fa/erste-schritte/نقشه-شهر',
    title: 'نقشه شهر',
    content: '',
    parentPath: '/augsburg/fa/erste-schritte',
    thumbnail: 'https://cms.integreat-app.de/augsburg/wp-content/uploads/sites/2/2015/09/pin66-150x150.png',
    order: 3,
    availableLanguages: new Map([['ar', '/augsburg/ar/erste-schritte/خريطة-المدينة']]),
    lastUpdate: moment('2016-01-07 10:36:24'),
    hash: '91d435afbc7aa83496137e81fd2832e3'
  })

  const categories = [
    new CategoryModel({
      root: true,
      path: '/augsburg/de',
      title: 'augsburg',
      parentPath: '',
      availableLanguages: new Map(),
      content: 'exampleContent0',
      lastUpdate: moment('2016-01-07 10:36:24'),
      order: 0,
      thumbnail: 'thumb-nail',
      hash: '91d435afbc7aa83496137e81fd2832e3'
    }),
    new CategoryModel({
      root: false,
      path: '/augsburg/de/willkommen',
      parentPath: '/augsburg/de',
      title: 'willkommen',
      order: 1,
      availableLanguages: new Map(),
      content: 'exampleContent0',
      lastUpdate: moment('2016-01-07 10:36:24'),
      thumbnail: 'thumb-nail',
      hash: '91d435afbc7aa83496137e81fd2832e3'
    }),
    new CategoryModel({
      root: false,
      path: '/augsburg/de/erste-schritte',
      parentPath: '/augsburg/de',
      title: 'erste-schritte',
      order: 2,
      availableLanguages: new Map(),
      content: 'exampleContent0',
      lastUpdate: moment('2016-01-07 10:36:24'),
      thumbnail: 'thumb-nail',
      hash: '91d435afbc7aa83496137e81fd2832e3'
    }),
    new CategoryModel({
      root: false,
      path: '/augsburg/de/erste-schritte/asylantrag',
      parentPath: '/augsburg/de/erste-schritte',
      title: 'asylantrag',
      order: 3,
      availableLanguages: new Map(),
      content: 'exampleContent0',
      lastUpdate: moment('2016-01-07 10:36:24'),
      thumbnail: 'thumb-nail',
      hash: '91d435afbc7aa83496137e81fd2832e3'
    })
  ]

  const categoriesMapModel = new CategoriesMapModel(categories)

  const category1 = categoriesMapModel.findCategoryByPath('/augsburg/de/')
  const category2 = categoriesMapModel.findCategoryByPath('/augsburg/de/willkommen')
  const category3 = categoriesMapModel.findCategoryByPath('/augsburg/de/erste-schritte///')
  const category4 = categoriesMapModel.findCategoryByPath('/augsburg/de/erste-schritte/asylantrag')

  if (!category1 || !category2 || !category3 || !category4) {
    throw new Error('Category not found. Error setting up tests.')
  }

  it('should get the right categories and normalize url components', () => {
    expect(category1).toEqual(categories[0])
    expect(category2).toEqual(categories[1])
    expect(category3).toEqual(categories[2])
    expect(category4).toEqual(categories[3])
  })

  it('should normalize url components correctly for special characters', () => {
    const map = new CategoriesMapModel([farsiCategory])
    const foundFarsiCategory = map.findCategoryByPath(
      '/augsburg/fa/erste-schritte/%D9%86%D9%82%D8%B4%D9%87-%D8%B4%D9%87%D8%B1'
    )
    expect(foundFarsiCategory).toEqual(farsiCategory)
  })

  it('should have the right parent attributes', () => {
    expect(category2.parentPath).toBe(category1.path)
    expect(category3.parentPath).toBe(category1.path)
    expect(category4.parentPath).toBe(category3.path)
  })

  it('should return all (mediate) parents in right order', () => {
    expect(categoriesMapModel.getAncestors(category4)[0]).toEqual(category1)
    expect(categoriesMapModel.getAncestors(category4)[1]).toEqual(category3)
  })

  it('should return all immediate children in the right order', () => {
    expect(categoriesMapModel.getChildren(category1)[0]).toEqual(category2)
    expect(categoriesMapModel.getChildren(category1)[1]).toEqual(category3)
  })

  it('should instruct CategoryModel to be leaf', () => {
    expect(categoriesMapModel.isLeaf(category4)).toBe(true)
    expect(categoriesMapModel.isLeaf(category3)).toBe(false)
  })
})
