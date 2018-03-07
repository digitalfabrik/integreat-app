import categories from '../categories'
import CategoriesMapModel from '../../models/CategoriesMapModel'

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

  const categoryModels = [{
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
  }, {
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
  }, {
    id: 0,
    url: '/augsburg/de',
    title: 'augsburg',
    availableLanguages: {},
    content: '',
    order: -1,
    parentId: -1,
    thumbnail: '',
    parentUrl: ''
  }]

  const state = {router: {params: {language: 'de', location: 'augsburg'}}}

  it('should map router to url', () => {
    expect(categories.mapStateToUrl(state)).toEqual(
      'https://cms.integreat-app.de/augsburg/de/wp-json/extensions/v0/modified_content/pages?since=1970-01-01T00:00:00Z'
    )
  })

  it('should map fetched data to models', () => {
    const response = categories.mapResponse(categoriesJSON, state)
    const categoriesMapModel = new CategoriesMapModel(categoryModels)
    expect(response).toEqual(categoriesMapModel)
  })
})
