import categories from '../categories'
import CategoriesMapModel from '../../models/CategoriesMapModel'
import CategoryModel from '../../models/CategoryModel'
import moment from 'moment'

jest.unmock('../categories')

describe('categories', () => {
  const categoriesJSON = [{
    id: 3650,
    path: '/augsburg/de/anlaufstellen',
    title: 'Anlaufstellen zu sonstigen Themen',
    content: '',
    parent: {},
    order: 75,
    available_languages: {
      en: {path: '/augsburg/en/anlaufstellen'}
    },
    thumbnail: 'https://cms.integreat-ap…/03/Hotline-150x150.png',
    modified_gmt: '2017-01-01'
  },
  {
    id: 3649,
    path: '/augsburg/de/willkommen',
    title: 'Willkommen',
    content: '',
    parent: {},
    order: 11,
    available_languages: {
      en: {path: '/augsburg/en/welcome'}
    },
    thumbnail: 'https://cms.integreat-ap…03/Beratung-150x150.png',
    modified_gmt: '2017-01-09'
  }]

  const categoryModels = [new CategoryModel({
    id: 3650,
    path: '/augsburg/de/anlaufstellen',
    title: 'Anlaufstellen zu sonstigen Themen',
    content: '',
    parentPath: '/augsburg/de',
    order: 75,
    availableLanguages: new Map([['en', '/augsburg/en/anlaufstellen']]),
    thumbnail: 'https://cms.integreat-ap…/03/Hotline-150x150.png',
    lastUpdate: moment('2017-01-01')
  }), new CategoryModel({
    id: 3649,
    path: '/augsburg/de/willkommen',
    title: 'Willkommen',
    content: '',
    availableLanguages: new Map([['en', '/augsburg/en/welcome']]),
    parentPath: '/augsburg/de',
    order: 11,
    thumbnail: 'https://cms.integreat-ap…03/Beratung-150x150.png',
    lastUpdate: moment('2017-01-09')
  }), new CategoryModel({
    id: 0,
    path: '/augsburg/de',
    title: 'augsburg',
    availableLanguages: new Map(),
    content: '',
    order: -1,
    thumbnail: '',
    parentPath: '',
    lastUpdate: ''
  })]

  const params = {language: 'de', city: 'augsburg'}

  it('should map router to path', () => {
    expect(categories.mapParamsToUrl(params)).toEqual(
      'https://cms.integreat-app.de/augsburg/de/wp-json/extensions/v3/pages'
    )
  })

  it('should throw if the city to map the path are missing', () => {
    expect(() => categories.mapParamsToUrl({})).toThrowErrorMatchingSnapshot()
  })

  it('should throw if the language to map the path are missing', () => {
    expect(() => categories.mapParamsToUrl({city: 'city'})).toThrowErrorMatchingSnapshot()
  })

  it('should map fetched data to models', () => {
    const response = categories.mapResponse(categoriesJSON, params)
    const categoriesMapModel = new CategoriesMapModel(categoryModels)
    expect(response).toEqual(categoriesMapModel)
  })

  it('should throw if city to map the data are missing', () => {
    expect(() => categories.mapResponse('json', {})).toThrowErrorMatchingSnapshot()
  })

  it('should throw if language to map the data are missing', () => {
    expect(() => categories.mapResponse('json', {city: 'city'})).toThrowErrorMatchingSnapshot()
  })
})
