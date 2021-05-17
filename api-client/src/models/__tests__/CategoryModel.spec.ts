import CategoryModel from '../CategoryModel'
import moment from 'moment'
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
    hash: '91d435afbc7aa83496137e81fd2832e3'
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
    hash: '91d435afbc7aa83496137e81fd2832e3'
  })
  it('should be conscious about being a root', () => {
    expect(category.isRoot()).toBe(false)
    expect(rootCategory.isRoot()).toBe(true)
  })
})
