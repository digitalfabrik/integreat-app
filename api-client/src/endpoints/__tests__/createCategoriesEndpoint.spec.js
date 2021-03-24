// @flow

import createCategoriesEndpoint from '../createCategoriesEndpoint'
import CategoriesMapModel from '../../models/CategoriesMapModel'
import CategoryModel from '../../models/CategoryModel'
import moment from 'moment-timezone'

describe('categories', () => {
  const baseUrl = 'https://integreat-api-url.de'

  const categories = createCategoriesEndpoint(baseUrl)

  const categoriesJSON = [
    {
      id: 3650,
      path: '/augsburg/de/anlaufstellen',
      title: 'Anlaufstellen zu sonstigen Themen',
      content: '<a href="javascript:IWantToBeRemoved();">Ich bleib aber da.</a>',
      excerpt: 'excerpt',
      parent: { id: 0, path: null, url: null },
      order: 75,
      available_languages: {
        en: { path: '/augsburg/en/anlaufstellen' }
      },
      thumbnail: 'https://cms.integreat-ap…/03/Hotline-150x150.png',
      modified_gmt: '2017-01-01 05:10:05',
      hash: '91d435afbc7aa83496137e81fd2832e3'
    },
    {
      id: 3649,
      path: '/augsburg/de/willkommen',
      title: 'Willkommen',
      content: '',
      excerpt: 'excerpt',
      parent: { id: 0, path: null, url: null },
      order: 11,
      available_languages: {
        en: { path: '/augsburg/en/welcome' }
      },
      thumbnail: 'https://cms.integreat-ap…03/Beratung-150x150.png',
      modified_gmt: '2017-01-09 15:30:00',
      hash: '91d435afbc7aa83496137e81fd2832e3'
    }
  ]

  const farsiCategoryJSON = {
    id: 404,
    url: 'https://cms.integreat-app.de/augsburg/fa/erste-schritte/%d9%86%d9%82%d8%b4%d9%87-%d8%b4%d9%87%d8%b1/',
    path: '/augsburg/fa/erste-schritte/%d9%86%d9%82%d8%b4%d9%87-%d8%b4%d9%87%d8%b1/',
    title: 'نقشه شهر',
    modified_gmt: '2016-01-07 10:36:24',
    content: '',
    excerpt: 'excerpt',
    parent: {
      id: 4827,
      url:
        'https://cms.integreat-app.de/augsburg/fa/erste-schritte/%d8%ae%d9%88%d8%b4-' +
        '%d8%a2%d9%85%d8%af%db%8c%d8%af-%d8%a8%d9%87-%d8%a2%da%af%d8%b2%d8%a8%d9%88%d8%b1%da%af/',
      path:
        '/augsburg/fa/erste-schritte/%d8%ae%d9%88%d8%b4-%d8%a2%d9%85%d8%af%db%8c%d8%af-%d8%a8%d9%87-' +
        '%d8%a2%da%af%d8%b2%d8%a8%d9%88%d8%b1%da%af/'
    },
    order: 3,
    available_languages: {
      ar: {
        id: 1370,
        url:
          'https://cms.integreat-app.de/augsburg/ar/erste-schritte/%d8%ae%d8%b1%d9%8a%d8%b7%d8%a9-' +
          '%d8%a7%d9%84%d9%85%d8%af%d9%8a%d9%86%d8%a9/',
        path: '/augsburg/ar/erste-schritte/%d8%ae%d8%b1%d9%8a%d8%b7%d8%a9-%d8%a7%d9%84%d9%85%d8%af%d9%8a%d9%86%d8%a9/'
      }
    },
    thumbnail: 'https://cms.integreat-app.de/augsburg/wp-content/uploads/sites/2/2015/09/pin66-150x150.png',
    hash: '91d435afbc7aa83496137e81fd2832e3'
  }

  const categoryModels = [
    new CategoryModel({
      root: false,
      path: '/augsburg/de/anlaufstellen',
      title: 'Anlaufstellen zu sonstigen Themen',
      content: '<a>Ich bleib aber da.</a>',
      parentPath: '/augsburg/de',
      order: 75,
      availableLanguages: new Map([['en', '/augsburg/en/anlaufstellen']]),
      thumbnail: 'https://cms.integreat-ap…/03/Hotline-150x150.png',
      lastUpdate: moment.tz('2017-01-01 05:10:05', 'GMT'),
      hash: '91d435afbc7aa83496137e81fd2832e3'
    }),
    new CategoryModel({
      root: false,
      path: '/augsburg/de/willkommen',
      title: 'Willkommen',
      content: '',
      availableLanguages: new Map([['en', '/augsburg/en/welcome']]),
      parentPath: '/augsburg/de',
      order: 11,
      thumbnail: 'https://cms.integreat-ap…03/Beratung-150x150.png',
      lastUpdate: moment.tz('2017-01-09 15:30:00', 'GMT'),
      hash: '91d435afbc7aa83496137e81fd2832e3'
    }),
    new CategoryModel({
      root: true,
      path: '/augsburg/de',
      title: 'augsburg',
      availableLanguages: new Map(),
      content: '',
      order: -1,
      thumbnail: '',
      parentPath: '',
      lastUpdate: moment(0),
      hash: ''
    })
  ]

  const params = { language: 'de', city: 'augsburg' }

  it('should map router to path', () => {
    expect(categories.mapParamsToUrl(params)).toEqual(
      'https://integreat-api-url.de/augsburg/de/wp-json/extensions/v3/pages'
    )
  })

  it('should map fetched data to models', () => {
    const response = categories.mapResponse(categoriesJSON, params)
    const categoriesMapModel = new CategoriesMapModel(categoryModels)
    expect(response).toEqual(categoriesMapModel)
  })

  it('should encode urls components correctly', () => {
    const response = categories.mapResponse([farsiCategoryJSON], params)
    const parsedCategory = response.toArray()[0]
    expect(parsedCategory.path).toBe('/augsburg/fa/erste-schritte/نقشه-شهر')
    expect(parsedCategory.parentPath).toBe('/augsburg/fa/erste-schritte/خوش-آمدید-به-آگزبورگ')
    expect(parsedCategory.availableLanguages.get('ar')).toBe('/augsburg/ar/erste-schritte/خريطة-المدينة')
  })
})
