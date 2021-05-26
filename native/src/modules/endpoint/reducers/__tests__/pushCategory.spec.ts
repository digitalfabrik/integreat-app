import { CATEGORIES_ROUTE, CategoriesMapModel, CategoryModel, LanguageModel } from 'api-client'
import moment from 'moment'
import { CityContentStateType } from '../../../app/StateType'
import cityContentReducer from '../cityContentReducer'
import { PushCategoryActionType } from '../../../app/StoreActionType'
describe('pushCategory', () => {
  const rootCategory = new CategoryModel({
    root: true,
    path: '/augsburg/de',
    title: 'Stadt Augsburg',
    content: 'lul',
    thumbnail: '',
    parentPath: '',
    order: 0,
    availableLanguages: new Map(),
    lastUpdate: moment('2017-11-18 19:30:00', moment.ISO_8601),
    hash: '123456'
  })
  const subCategory = new CategoryModel({
    root: false,
    path: '/augsburg/de/sub',
    title: 'Subkategorie',
    content: 'lul',
    thumbnail: '',
    parentPath: '/augsburg/de',
    order: 0,
    availableLanguages: new Map([['en', '/augsburg/en/sub']]),
    lastUpdate: moment('2017-11-18 19:30:00', moment.ISO_8601),
    hash: '123456'
  })
  const subSubCategory = new CategoryModel({
    root: false,
    path: '/augsburg/de/sub/sub',
    title: 'Subsubkategorie',
    content: 'lul',
    thumbnail: '',
    parentPath: '/augsburg/de/sub',
    order: 0,
    availableLanguages: new Map([['en', '/augsburg/en/sub/sub']]),
    lastUpdate: moment('2017-11-18 19:30:00', moment.ISO_8601),
    hash: '123456'
  })
  const categoriesMap = new CategoriesMapModel([rootCategory, subCategory, subSubCategory])
  const languageModels = [new LanguageModel('de', 'Deutsch'), new LanguageModel('en', 'English')]

  const prepareState = (state: Partial<CityContentStateType>): CityContentStateType => {
    const defaultState: CityContentStateType = {
      city: 'augsburg',
      routeMapping: {
        'route-id-1': {
          routeType: CATEGORIES_ROUTE,
          status: 'ready',
          path: '/augsburg/de',
          depth: 2,
          language: 'de',
          city: 'augsburg',
          allAvailableLanguages: new Map(),
          models: {
            '/augsburg/de': rootCategory,
            '/augsburg/de/sub': subCategory,
            '/augsburg/de/sub/sub': subSubCategory
          },
          children: {
            '/augsburg/de': ['/augsburg/de/sub'],
            '/augsburg/de/sub': ['/augsburg/de/sub/sub']
          }
        }
      },
      languages: {
        status: 'ready',
        models: languageModels
      },
      resourceCache: {
        status: 'ready',
        progress: 1,
        value: {
          '/augsburg/de': {
            'some-url': {
              filePath: 'some-path',
              lastUpdate: moment('2017-11-18 19:30:00', moment.ISO_8601),
              hash: '123456'
            }
          }
        }
      },
      searchRoute: {
        categoriesMap
      },
      switchingLanguage: false
    }
    return { ...defaultState, ...state }
  }

  it('should add rootCategory to categoriesRouteMapping with depth 1', () => {
    const prevState: CityContentStateType = prepareState({
      routeMapping: {},
      resourceCache: {
        status: 'ready',
        progress: 0,
        value: {}
      }
    })
    const pushCategoryAction: PushCategoryActionType = {
      type: 'PUSH_CATEGORY',
      params: {
        categoriesMap,
        resourceCache: {},
        cityLanguages: [new LanguageModel('en', 'English'), new LanguageModel('de', 'Deutsch')],
        city: 'augsburg',
        language: 'de',
        path: '/augsburg/de',
        depth: 1,
        key: 'route-id-0',
        refresh: false
      }
    }
    expect(cityContentReducer(prevState, pushCategoryAction)).toEqual(
      expect.objectContaining({
        routeMapping: {
          'route-id-0': {
            routeType: CATEGORIES_ROUTE,
            status: 'ready',
            path: '/augsburg/de',
            allAvailableLanguages: new Map([
              ['en', '/augsburg/en'],
              ['de', '/augsburg/de']
            ]),
            children: {
              '/augsburg/de': ['/augsburg/de/sub']
            },
            city: 'augsburg',
            depth: 1,
            language: 'de',
            models: {
              '/augsburg/de': rootCategory,
              '/augsburg/de/sub': subCategory
            }
          }
        }
      })
    )
  })
  it('should add subCategory to routeMapping with depth 1', () => {
    const prevState = prepareState({
      resourceCache: {
        status: 'ready',
        progress: 0,
        value: {}
      }
    })
    const pushCategoryAction: PushCategoryActionType = {
      type: 'PUSH_CATEGORY',
      params: {
        categoriesMap,
        resourceCache: {},
        cityLanguages: languageModels,
        city: 'augsburg',
        language: 'de',
        path: '/augsburg/de/sub',
        depth: 1,
        key: 'route-id-1',
        refresh: false
      }
    }
    expect(cityContentReducer(prevState, pushCategoryAction)).toEqual(
      expect.objectContaining({
        routeMapping: {
          'route-id-1': {
            routeType: CATEGORIES_ROUTE,
            status: 'ready',
            path: '/augsburg/de/sub',
            allAvailableLanguages: new Map([
              ['en', '/augsburg/en/sub'],
              ['de', '/augsburg/de/sub']
            ]),
            children: {
              '/augsburg/de/sub': ['/augsburg/de/sub/sub']
            },
            city: 'augsburg',
            depth: 1,
            language: 'de',
            models: {
              '/augsburg/de/sub': subCategory,
              '/augsburg/de/sub/sub': subSubCategory
            }
          }
        }
      })
    )
  })
  it("should merge the resource cache if there's already one", () => {
    const prevState = prepareState({})

    if (prevState.resourceCache.status !== 'ready') {
      throw new Error('Preparation failed')
    }

    const prevResources = prevState.resourceCache.value
    const testumgebungRootCategory = new CategoryModel({
      root: true,
      path: '/testumgebung/de',
      title: 'T',
      content: 'rofl',
      thumbnail: '',
      parentPath: '',
      order: 0,
      availableLanguages: new Map(),
      lastUpdate: moment('2000-01-05T10:10:00.000Z'),
      hash: '123456'
    })
    const testumgebungCategoriesMap = new CategoriesMapModel([testumgebungRootCategory])
    const resourceCache = {
      '/testumgebung/de': {
        'another-url': {
          filePath: 'another-path',
          lastUpdate: moment('2017-11-18 19:30:00', moment.ISO_8601),
          hash: '123456'
        }
      }
    }
    const pushCategoryAction: PushCategoryActionType = {
      type: 'PUSH_CATEGORY',
      params: {
        categoriesMap: testumgebungCategoriesMap,
        resourceCache,
        cityLanguages: [new LanguageModel('en', 'English'), new LanguageModel('de', 'Deutsch')],
        city: 'testumgebung',
        language: 'de',
        path: '/testumgebung/de',
        depth: 1,
        key: 'route-id-0',
        refresh: false
      }
    }
    expect(cityContentReducer(prevState, pushCategoryAction)).toEqual(
      expect.objectContaining({
        city: 'augsburg',
        resourceCache: {
          status: 'ready',
          progress: 1,
          value: { ...prevResources, ...resourceCache }
        }
      })
    )
  })
  it('should add categoriesMap to the searchRoute', () => {
    const prevState: CityContentStateType = prepareState({
      searchRoute: null,
      resourceCache: {
        status: 'ready',
        progress: 0,
        value: {}
      }
    })
    const pushCategoryAction: PushCategoryActionType = {
      type: 'PUSH_CATEGORY',
      params: {
        categoriesMap,
        resourceCache: {},
        cityLanguages: [new LanguageModel('en', 'English'), new LanguageModel('de', 'Deutsch')],
        city: 'augsburg',
        language: 'de',
        path: '/augsburg/de',
        depth: 1,
        key: 'route-id-0',
        refresh: false
      }
    }
    expect(cityContentReducer(prevState, pushCategoryAction)).toEqual(
      expect.objectContaining({
        searchRoute: {
          categoriesMap
        }
      })
    )
  })
})
