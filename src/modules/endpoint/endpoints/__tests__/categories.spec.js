import categories from '../categories'
import CategoriesModel from '../../models/CategoriesModel'
import CategoryModel from '../../models/CategoryModel'

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
  }]

  const categoryModels = [
    new CategoryModel({
      id: 3650,
      url: '/augsburg/de/anlaufstellen',
      title: 'Anlaufstellen zu sonstigen Themen',
      content: '',
      parent: 0,
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
      parent: 0,
      order: 11,
      availableLanguages: {
        en: 4804, ar: 4819, fa: 4827
      },
      thumbnail: 'https://cms.integreat-ap…03/Beratung-150x150.png'
    }),
    new CategoryModel({id: 0, url: '/augsburg/de', title: 'augsburg'})
  ]

  const urlParams = {language: 'de', location: 'augsburg'}

  const router = {router: {params: {language: 'de', location: 'augsburg'}}}

  test('should map state to urls', () => {
    expect(categories.mapStateToUrlParams(router)).toEqual(urlParams)
  })

  test('should map fetched data to models', () => {
    const response = categories.mapResponse(categoriesJSON, urlParams)
    const categoriesModel = new CategoriesModel(categoryModels)
    expect(response).toEqual(categoriesModel)
  })
})
