import categoriesMapper from '../categories'
import CategoriesMapModel from '../../models/CategoriesMapModel'
import CategoryModel from '../../models/CategoryModel'

jest.unmock('../categories')

describe('categories', () => {
  const categoriesJSON = [{
    id: 3650,
    permalink: {
      url_page: 'anlaufstellen'
    },
    title: 'Anlaufstellen zu sonstigen Themen',
    status: 'publish',
    content: '',
    parent: 0,
    order: 75,
    available_languages: {
      en: 4361,
      ar: 4367,
      fa: 4368
    },
    thumbnail: 'https://cms.integreat-ap…/03/Hotline-150x150.png'
  },
  {
    id: 3649,
    permalink: {
      url_page: 'willkommen'
    },
    title: 'Willkommen',
    status: 'publish',
    content: '',
    parent: 0,
    order: 11,
    available_languages: {
      en: 4804,
      ar: 4819,
      fa: 4827
    },
    thumbnail: 'https://cms.integreat-ap…03/Beratung-150x150.png'
  },
  {
    id: 1234,
    permalink: {
      url_page: 'trash'
    },
    title: 'Trash',
    status: 'trash'
  }]

  const categoryModels = [
    new CategoryModel({
      id: 3650,
      url: '/augsburg/de/anlaufstellen',
      title: 'Anlaufstellen zu sonstigen Themen',
      content: '',
      parentId: 0,
      parentUrl: '/augsburg/de',
      order: 75,
      availableLanguages: {
        en: 4361, ar: 4367, fa: 4368
      },
      thumbnail: 'https://cms.integreat-ap…/03/Hotline-150x150.png'
    }),
    new CategoryModel({
      id: 3649,
      url: '/augsburg/de/willkommen',
      title: 'Willkommen',
      content: '',
      parentId: 0,
      parentUrl: '/augsburg/de',
      order: 11,
      availableLanguages: {
        en: 4804, ar: 4819, fa: 4827
      },
      thumbnail: 'https://cms.integreat-ap…03/Beratung-150x150.png'
    }),
    new CategoryModel({id: 0, url: '/augsburg/de', title: 'augsburg'})
  ]

  const params = {language: 'de', location: 'augsburg'}

  it('should map fetched data to models', () => {
    const response = categoriesMapper(categoriesJSON, params)
    const categoriesMapModel = new CategoriesMapModel(categoryModels)
    expect(response).toEqual(categoriesMapModel)
  })
})
