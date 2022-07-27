import moment from 'moment'

import CategoryModel from '../CategoryModel'

describe('CategoryModel', () => {
  const rootCategory = new CategoryModel({
    root: true,
    path: '/augsburg/en/',
    title: 'Welcome',
    content: '',
    parentPath: '/augsburg/en',
    order: 75,
    availableLanguages: new Map([['de', '/augsburg/de/']]),
    thumbnail: 'https://cms.integreat-ap…/03/Hotline-150x150.png',
    lastUpdate: moment('2016-01-07 10:36:24'),
  })
  const category = new CategoryModel({
    root: false,
    path: '/augsburg/en/welcome',
    title: 'Welcome',
    content: '',
    parentPath: '/augsburg/en',
    order: 75,
    availableLanguages: new Map([['de', '/augsburg/de/willkommen']]),
    thumbnail: 'https://cms.integreat-ap…/03/Hotline-150x150.png',
    lastUpdate: moment('2016-01-07 10:36:24'),
  })

  it('should be conscious about being a root', () => {
    expect(category.isRoot()).toBe(false)
    expect(rootCategory.isRoot()).toBe(true)
  })

  it('should normalize paths', () => {
    const normalizedCategory = new CategoryModel({
      root: false,
      path: '/augsburg/fa/erste-schritte/%D9%86%D9%82%D8%B4%D9%87-%D8%B4%D9%87%D8%B1/',
      title: 'Welcome',
      content: '',
      parentPath: '/augsburg/fa/erste-schritte/',
      order: 75,
      availableLanguages: new Map([['de', '/augsburg/de/willkommen']]),
      thumbnail: 'https://cms.integreat-ap…/03/Hotline-150x150.png',
      lastUpdate: moment('2016-01-07 10:36:24'),
    })
    expect(normalizedCategory.path).toBe('/augsburg/fa/erste-schritte/نقشه-شهر')
    expect(normalizedCategory.parentPath).toBe('/augsburg/fa/erste-schritte')
  })
})
