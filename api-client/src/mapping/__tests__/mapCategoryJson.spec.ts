import mapCategoryJson from '../mapCategoryJson'
import CategoryModel from '../../models/CategoryModel'
import moment from 'moment-timezone'
describe('categories', () => {
  const basePath = '/augsburg/de'
  const categoryJson1 = {
    id: 3650,
    url: 'https://cms.integreat-app.de/augsburg/de/anlaufstellen',
    path: '/augsburg/de/anlaufstellen',
    title: 'Anlaufstellen zu sonstigen Themen',
    content: '<a href="javascript:IWantToBeRemoved();">Ich bleib aber da.</a>',
    excerpt: 'excerpt',
    parent: {
      id: 0,
      path: null,
      url: null
    },
    order: 75,
    available_languages: {
      en: {
        id: 3651,
        path: '/augsburg/en/anlaufstellen',
        url: 'https://cms.integreat-app.de/augsburg/en/anlaufstellen'
      }
    },
    thumbnail: 'https://cms.integreat-ap…/03/Hotline-150x150.png',
    modified_gmt: '2017-01-01 05:10:05',
    hash: '91d435afbc7aa83496137e81fd2832e3'
  }
  const categoryJson2 = {
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
        '/augsburg/fa/erste-schritte/%d8%ae%d9%88%d8%b4-%d8%a2%d9%85%d8%af%db%8c%d8%af-%d8%a8%d9%87-%d8%a2%da%af%d8%b2%d8%a8%d9%88%d8%b1%da%af/'
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
    thumbnail: 'https://example.com/thumbnail',
    hash: '91d435afbc7aa83496137e81fd2832e3'
  }
  const categoryModel1 = new CategoryModel({
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
    lastUpdate: moment.tz('2016-01-07 10:36:24', 'GMT'),
    hash: '91d435afbc7aa83496137e81fd2832e3'
  })
  it('should map json correctly', () => {
    const category = mapCategoryJson(categoryJson1, basePath)
    expect(category).toEqual(categoryModel1)
  })
  it('should map farsi json correctly', () => {
    const category = mapCategoryJson(categoryJson2, basePath)
    expect(category).toEqual(categoryModel2)
  })
  it('should sanitize html', () => {
    // TODO IGAPP-564
  })
})