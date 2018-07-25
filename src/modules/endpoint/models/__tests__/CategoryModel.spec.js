import CategoryModel from '../CategoryModel'

describe('CategoryModel', () => {
  const rootCategory = new CategoryModel({
    id: 0,
    path: '/augsburg/en/',
    title: 'Welcome',
    content: '',
    parentPath: '/augsburg/en',
    order: 75,
    availableLanguages: new Map([['de', '/augsburg/de/']]),
    thumbnail: 'https://cms.integreat-ap…/03/Hotline-150x150.png'
  })

  const category = new CategoryModel({
    id: 5463,
    path: '/augsburg/en/welcome',
    title: 'Welcome',
    content: '',
    parentPath: '/augsburg/en',
    order: 75,
    availableLanguages: new Map([['de', '/augsburg/de/willkommen']]),
    thumbnail: 'https://cms.integreat-ap…/03/Hotline-150x150.png'
  })

  it('should be conscious about being a root', () => {
    expect(category.isRoot()).toBe(false)
    expect(rootCategory.isRoot()).toBe(true)
  })
})
