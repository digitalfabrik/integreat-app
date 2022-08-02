import moment from 'moment'

import { CATEGORIES_ROUTE, CategoriesMapModel, CategoryModel, LanguageModel, ErrorCode } from 'api-client'

import { CityContentStateType } from '../../StateType'
import { PushCategoryActionType } from '../../StoreActionType'
import cityContentReducer from '../cityContentReducer'

describe('pushCategory', () => {
  const buildCategory = (
    root: boolean,
    path: string,
    title: string,
    parentPath: string,
    availableLanguages: Map<string, string>
  ): CategoryModel =>
    new CategoryModel({
      root,
      path,
      title,
      content: 'lul',
      thumbnail: '',
      parentPath,
      order: 0,
      availableLanguages,
      lastUpdate: moment('2017-11-18 19:30:00', moment.ISO_8601),
    })

  const rootCategory = buildCategory(true, '/augsburg/de', 'Stadt Augsburg', '', new Map())
  const subCategory = buildCategory(
    false,
    '/augsburg/de/sub',
    'Subkategorie',
    '/augsburg/de',
    new Map([['en', '/augsburg/en/sub']])
  )
  const subSubCategory = buildCategory(
    false,
    '/augsburg/de/sub/sub',
    'Subsubkategorie',
    '/augsburg/de/sub',
    new Map([['en', '/augsburg/en/sub/sub']])
  )

  const categoriesMap = new CategoriesMapModel([rootCategory, subCategory, subSubCategory])
  const languageModels = [new LanguageModel('de', 'Deutsch'), new LanguageModel('en', 'English')]

  const createPushAction = (params: Partial<PushCategoryActionType['params']> = {}): PushCategoryActionType => ({
    type: 'PUSH_CATEGORY',
    params: {
      categoriesMap,
      resourceCache: {},
      cityLanguages: languageModels,
      city: 'augsburg',
      language: 'de',
      path: '/augsburg/de',
      depth: 1,
      key: 'route-id-0',
      refresh: false,
      ...params,
    },
  })

  const prepareState = (state: Partial<CityContentStateType> = {}): CityContentStateType => {
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
            '/augsburg/de/sub/sub': subSubCategory,
          },
          children: {
            '/augsburg/de': ['/augsburg/de/sub'],
            '/augsburg/de/sub': ['/augsburg/de/sub/sub'],
          },
        },
      },
      languages: {
        status: 'ready',
        models: languageModels,
      },
      resourceCache: {
        status: 'ready',
        progress: 1,
        value: {
          '/augsburg/de': {
            'some-url': {
              filePath: 'some-path',
              lastUpdate: moment('2017-11-18 19:30:00', moment.ISO_8601),
              hash: '123456',
            },
          },
        },
      },
      searchRoute: {
        categoriesMap,
      },
      switchingLanguage: false,
    }
    return { ...defaultState, ...state }
  }

  it('should add rootCategory to categoriesRouteMapping with depth 1', () => {
    const prevState: CityContentStateType = prepareState({
      routeMapping: {},
      resourceCache: {
        status: 'ready',
        progress: 0,
        value: {},
      },
    })
    const pushCategoryAction = createPushAction()

    expect(cityContentReducer(prevState, pushCategoryAction)).toEqual(
      expect.objectContaining({
        routeMapping: {
          'route-id-0': {
            routeType: CATEGORIES_ROUTE,
            status: 'ready',
            path: '/augsburg/de',
            allAvailableLanguages: new Map([
              ['en', '/augsburg/en'],
              ['de', '/augsburg/de'],
            ]),
            children: {
              '/augsburg/de': ['/augsburg/de/sub'],
            },
            city: 'augsburg',
            depth: 1,
            language: 'de',
            models: {
              '/augsburg/de': rootCategory,
              '/augsburg/de/sub': subCategory,
            },
          },
        },
      })
    )
  })
  it('should add subCategory to routeMapping with depth 1', () => {
    const prevState = prepareState({
      resourceCache: {
        status: 'ready',
        progress: 0,
        value: {},
      },
    })
    const pushCategoryAction = createPushAction({ path: '/augsburg/de/sub', key: 'route-id-1' })

    expect(cityContentReducer(prevState, pushCategoryAction)).toEqual(
      expect.objectContaining({
        routeMapping: {
          'route-id-1': {
            routeType: CATEGORIES_ROUTE,
            status: 'ready',
            path: '/augsburg/de/sub',
            allAvailableLanguages: new Map([
              ['en', '/augsburg/en/sub'],
              ['de', '/augsburg/de/sub'],
            ]),
            children: {
              '/augsburg/de/sub': ['/augsburg/de/sub/sub'],
            },
            city: 'augsburg',
            depth: 1,
            language: 'de',
            models: {
              '/augsburg/de/sub': subCategory,
              '/augsburg/de/sub/sub': subSubCategory,
            },
          },
        },
      })
    )
  })
  it("should merge the resource cache if there's already one", () => {
    const prevState = prepareState()

    if (prevState.resourceCache.status !== 'ready') {
      throw new Error('Preparation failed')
    }

    const prevResources = prevState.resourceCache.value
    const testumgebungRootCategory = buildCategory(true, '/testumgebung/de', 'Title', '', new Map())

    const testumgebungCategoriesMap = new CategoriesMapModel([testumgebungRootCategory])
    const resourceCache = {
      '/testumgebung/de': {
        'another-url': {
          filePath: 'another-path',
          lastUpdate: moment('2017-11-18 19:30:00', moment.ISO_8601),
          hash: '123456',
        },
      },
    }
    const pushCategoryAction = createPushAction({
      categoriesMap: testumgebungCategoriesMap,
      resourceCache,
      city: 'testumgebung',
      path: '/testumgebung/de',
      key: 'route-id-0',
    })

    expect(cityContentReducer(prevState, pushCategoryAction)).toEqual(
      expect.objectContaining({
        city: 'augsburg',
        resourceCache: {
          status: 'ready',
          progress: 1,
          value: { ...prevResources, ...resourceCache },
        },
      })
    )
  })

  it('should add categoriesMap to the searchRoute', () => {
    const prevState: CityContentStateType = prepareState({
      searchRoute: null,
      resourceCache: {
        status: 'ready',
        progress: 0,
        value: {},
      },
    })

    const pushCategoryAction = createPushAction()
    expect(cityContentReducer(prevState, pushCategoryAction)).toEqual(
      expect.objectContaining({
        searchRoute: {
          categoriesMap,
        },
      })
    )
  })

  it('should return an error for a nonexisting category', () => {
    const prevState: CityContentStateType = prepareState({
      routeMapping: {},
      resourceCache: {
        status: 'ready',
        progress: 0,
        value: {},
      },
    })

    const nonExistingPath = '/augsburg/de/nonexisting'
    const pushCategoryAction = createPushAction({ path: nonExistingPath })
    expect(cityContentReducer(prevState, pushCategoryAction)).toEqual(
      expect.objectContaining({
        routeMapping: {
          'route-id-0': {
            routeType: CATEGORIES_ROUTE,
            path: nonExistingPath,
            depth: 1,
            language: 'de',
            city: 'augsburg',
            status: 'error',
            message: `Could not find a category with path '${nonExistingPath}'.`,
            code: ErrorCode.PageNotFound,
          },
        },
      })
    )
  })
})
