import { DateTime } from 'luxon'

import CategoryModel from '../../models/CategoryModel'
import OfferModel from '../../models/OfferModel'
import OrganizationModel from '../../models/OrganizationModel'
import mapCategoryJson from '../mapCategoryJson'

describe('categories', () => {
  const basePath = '/augsburg/de'
  const categoryJson1 = {
    id: 3650,
    url: 'https://cms.integreat-app.de/augsburg/de/anlaufstellen',
    path: '/augsburg/de/anlaufstellen',
    title: 'Anlaufstellen zu sonstigen Themen',
    content: '<div>Some category test content :)</div>',
    excerpt: 'excerpt',
    parent: {
      id: 0,
      path: null,
      url: null,
    },
    order: 75,
    available_languages: {
      en: {
        id: 3651,
        path: '/augsburg/en/anlaufstellen',
        url: 'https://cms.integreat-app.de/augsburg/en/anlaufstellen',
      },
    },
    thumbnail: 'https://cms.integreat-ap…/03/Hotline-150x150.png',
    last_updated: '2017-01-01T05:10:05+02:00',
    organization: null,
    embedded_offers: [],
  }
  const categoryJson2 = {
    id: 404,
    url: 'https://cms.integreat-app.de/augsburg/fa/erste-schritte/%d9%86%d9%82%d8%b4%d9%87-%d8%b4%d9%87%d8%b1/',
    path: '/augsburg/fa/erste-schritte/%d9%86%d9%82%d8%b4%d9%87-%d8%b4%d9%87%d8%b1/',
    title: 'نقشه شهر',
    last_updated: '2016-01-07T10:36:24+02:00',
    content: '',
    excerpt: 'excerpt',
    parent: {
      id: 4827,
      url:
        'https://cms.integreat-app.de/augsburg/fa/erste-schritte/%d8%ae%d9%88%d8%b4-' +
        '%d8%a2%d9%85%d8%af%db%8c%d8%af-%d8%a8%d9%87-%d8%a2%da%af%d8%b2%d8%a8%d9%88%d8%b1%da%af/',
      path: '/augsburg/fa/erste-schritte/%d8%ae%d9%88%d8%b4-%d8%a2%d9%85%d8%af%db%8c%d8%af-%d8%a8%d9%87-%d8%a2%da%af%d8%b2%d8%a8%d9%88%d8%b1%da%af/',
    },
    order: 3,
    available_languages: {
      ar: {
        id: 1370,
        url:
          'https://cms.integreat-app.de/augsburg/ar/erste-schritte/%d8%ae%d8%b1%d9%8a%d8%b7%d8%a9-' +
          '%d8%a7%d9%84%d9%85%d8%af%d9%8a%d9%86%d8%a9/',
        path: '/augsburg/ar/erste-schritte/%d8%ae%d8%b1%d9%8a%d8%b7%d8%a9-%d8%a7%d9%84%d9%85%d8%af%d9%8a%d9%86%d8%a9/',
      },
    },
    thumbnail: 'https://example.com/thumbnail',
    organization: {
      name: 'Tür an Tür',
      logo: 'https://example.com/my-icon',
      website: 'https://example.com',
    },
    embedded_offers: [
      {
        alias: 'serlo-abc',
        thumbnail: 'some_thumbnail',
        name: 'Serlo ABC',
        url: 'https://abc-app.serlo.org/',
      },
      {
        alias: 'sprungbrett',
        thumbnail: 'some_other_thumbnail',
        name: 'Sprungbrett',
        url: 'https://web.integreat-app.de/proxy/sprungbrett/app-search-internships?location=augsburg',
      },
      {
        alias: 'help',
        thumbnail: 'some_other_thumbnail',
        name: 'Hilfebutton',
        url: '',
        post: {
          'zammad-url': 'https://zammad-malte.tuerantuer.org/',
        },
      },
    ],
  }
  const offerModels = [
    new OfferModel({
      alias: 'serlo-abc',
      thumbnail: 'some_thumbnail',
      title: 'Serlo ABC',
      path: 'https://abc-app.serlo.org/',
    }),
    new OfferModel({
      alias: 'sprungbrett',
      thumbnail: 'some_other_thumbnail',
      title: 'Sprungbrett',
      path: 'https://web.integreat-app.de/proxy/sprungbrett/app-search-internships?location=augsburg',
    }),
    new OfferModel({
      alias: 'help',
      thumbnail: 'some_other_thumbnail',
      title: 'Hilfebutton',
      path: 'https://zammad-malte.tuerantuer.org/',
    }),
  ]
  const categoryModel1 = new CategoryModel({
    root: false,
    path: '/augsburg/de/anlaufstellen',
    title: 'Anlaufstellen zu sonstigen Themen',
    content: '<div>Some category test content :)</div>',
    parentPath: '/augsburg/de',
    order: 75,
    availableLanguages: new Map([['en', '/augsburg/en/anlaufstellen']]),
    thumbnail: 'https://cms.integreat-ap…/03/Hotline-150x150.png',
    lastUpdate: DateTime.fromISO('2017-01-01T05:10:05+02:00'),
    organization: null,
    embeddedOffers: [],
  })
  const categoryModel2 = new CategoryModel({
    root: false,
    path: '/augsburg/fa/erste-schritte/نقشه-شهر',
    title: 'نقشه شهر',
    content: '',
    availableLanguages: new Map([['ar', '/augsburg/ar/erste-schritte/خريطة-المدينة']]),
    parentPath: '/augsburg/fa/erste-schritte/خوش-آمدید-به-آگزبورگ',
    order: 3,
    thumbnail: 'https://example.com/thumbnail',
    lastUpdate: DateTime.fromISO('2016-01-07T10:36:24+02:00'),
    organization: new OrganizationModel({
      name: 'Tür an Tür',
      logo: 'https://example.com/my-icon',
      url: 'https://example.com',
    }),
    embeddedOffers: offerModels,
  })

  it('should map json correctly', () => {
    const category = mapCategoryJson(categoryJson1, basePath)
    expect(category).toEqual(categoryModel1)
  })
  it('should map farsi json correctly', () => {
    const category = mapCategoryJson(categoryJson2, basePath)
    expect(category).toEqual(categoryModel2)
  })
})
