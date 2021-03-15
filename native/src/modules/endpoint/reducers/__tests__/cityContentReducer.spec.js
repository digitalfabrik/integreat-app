// @flow

import type {
  CityContentActionType,
  FetchCategoryActionType,
  FetchEventActionType,
  PushCategoryActionType
} from '../../../app/StoreActionType'
import { CATEGORIES_ROUTE, CategoriesMapModel, EVENTS_ROUTE, LanguageModel } from 'api-client'
import cityContentReducer from '../cityContentReducer'
import type { CityContentStateType } from '../../../app/StateType'
import ErrorCodes from '../../../error/ErrorCodes'

describe('cityContentReducer', () => {
  const switchContentLanguageAction = {
    type: 'SWITCH_CONTENT_LANGUAGE',
    params: { newLanguage: 'de', city: 'augsburg', t: key => key }
  }
  const switchContentLanguageFailedAction = {
    type: 'SWITCH_CONTENT_LANGUAGE_FAILED', params: { message: 'Some error' }
  }
  const pushLanguagesAction = { type: 'PUSH_LANGUAGES', params: { languages: [new LanguageModel('de', 'Deutsch')] } }
  const pushCategoryAction: PushCategoryActionType = {
    type: 'PUSH_CATEGORY',
    params: {
      categoriesMap: new CategoriesMapModel([]),
      resourceCache: {},
      cityLanguages: [new LanguageModel('de', 'Deutsch')],
      city: 'augsburg',
      language: 'de',
      path: '/augsburg/de',
      depth: 2,
      key: 'route-id-0',
      refresh: false
    }
  }
  const pushEventAction = {
    type: 'PUSH_EVENT',
    params: {
      events: [],
      path: null,
      key: 'route-id-0',
      resourceCache: {},
      cityLanguages: [],
      language: 'de',
      city: 'augsburg',
      refresh: false
    }
  }
  const morphContentLanguageAction = {
    type: 'MORPH_CONTENT_LANGUAGE',
    params: {
      newCategoriesMap: new CategoriesMapModel([]),
      newResourceCache: {},
      newEvents: [],
      newPois: [],
      newLanguage: 'de'
    }
  }
  const fetchCategoryFailedAction = {
    type: 'FETCH_CATEGORY_FAILED',
    params: {
      key: 'route-id-0',
      message: 'Some error',
      code: ErrorCodes.UnknownError,
      path: '/augsburg/de',
      city: 'augsburg',
      language: 'de',
      depth: 2,
      allAvailableLanguages: null
    }
  }
  const fetchEventFailedAction = {
    type: 'FETCH_EVENT_FAILED',
    params: {
      key: 'route-id-0',
      message: 'Some error',
      code: ErrorCodes.UnknownError,
      path: null,
      city: 'augsburg',
      language: 'de',
      allAvailableLanguages: null
    }
  }
  const fetchResourcesFailedAction = {
    type: 'FETCH_RESOURCES_FAILED',
    params: { message: 'Some error', code: ErrorCodes.UnknownError }
  }

  const fetchLanguagesFailed = {
    type: 'FETCH_LANGUAGES_FAILED',
    params: { message: 'Some error', code: ErrorCodes.UnknownError }
  }

  const languageModels = [new LanguageModel('de', 'Deutsch'), new LanguageModel('en', 'English')]

  // these actions should not thrown an error if then state is unitialized
  const softUnsupportedActionsOnUnitializedState: Array<CityContentActionType> = [
    pushCategoryAction,
    pushEventAction,
    morphContentLanguageAction,
    fetchCategoryFailedAction,
    fetchResourcesFailedAction,
    switchContentLanguageAction,
    pushLanguagesAction,
    fetchEventFailedAction,
    fetchLanguagesFailed
  ]

  for (const action of softUnsupportedActionsOnUnitializedState) {
    // eslint-disable-next-line no-loop-func
    it(`should return null on ${action.type} if state is unitialized`, () => {
      expect(cityContentReducer(null, action)).toBeNull()
    })
  }

  let prevState: CityContentStateType
  beforeEach(() => {
    prevState = {
      city: 'augsburg',
      routeMapping: {},
      languages: { status: 'ready', models: languageModels },
      resourceCache: { status: 'ready', progress: 0, value: {} },
      searchRoute: null,
      switchingLanguage: false
    }
  })

  it('should set switchingLanguage to true on SWITCH_CONTENT_LANGUAGE', () => {
    const prevState: CityContentStateType = {
      city: 'augsburg',
      routeMapping: {},
      languages: { status: 'ready', models: [] },
      resourceCache: { status: 'ready', progress: 0, value: {} },
      searchRoute: null,
      switchingLanguage: false
    }
    expect(cityContentReducer(prevState, switchContentLanguageAction)?.switchingLanguage).toBe(true)
  })

  it('should set switchingLanguage to false on SWITCH_CONTENT_LANGUAGE_FAILED', () => {
    const prevState: CityContentStateType = {
      city: 'augsburg',
      routeMapping: {},
      languages: { status: 'ready', models: [] },
      resourceCache: { status: 'ready', progress: 0, value: {} },
      searchRoute: null,
      switchingLanguage: true
    }
    expect(cityContentReducer(prevState, switchContentLanguageFailedAction)?.switchingLanguage).toBe(false)
  })

  it('should set languages on PUSH_LANGUAGES', () => {
    const prevState: CityContentStateType = {
      city: 'augsburg',
      routeMapping: {},
      languages: { status: 'ready', models: [] },
      resourceCache: { status: 'ready', progress: 0, value: {} },
      searchRoute: null,
      switchingLanguage: false
    }
    expect(cityContentReducer(prevState, pushLanguagesAction)?.languages).toEqual(
      { status: 'ready', models: pushLanguagesAction.params.languages })
  })

  it('should set error on FETCH_LANGUAGES_FAILED', () => {
    const prevState: CityContentStateType = {
      city: 'augsburg',
      routeMapping: {},
      languages: { status: 'ready', models: [] },
      resourceCache: { status: 'ready', progress: 0, value: {} },
      searchRoute: null,
      switchingLanguage: false
    }
    expect(cityContentReducer(prevState, fetchLanguagesFailed)?.languages).toEqual(
      { status: 'error', ...fetchLanguagesFailed.params })
  })

  it('should initialize cityContentState on FETCH_EVENT with loading route', () => {
    const action: FetchEventActionType = {
      type: 'FETCH_EVENT',
      params: {
        city: 'augsburg',
        language: 'de',
        path: null,
        key: 'route-id-0',
        criterion: { forceUpdate: false, shouldRefreshResources: false }
      }
    }

    expect(cityContentReducer(null, action)).toEqual({
      city: 'augsburg',
      routeMapping: {
        'route-id-0': {
          routeType: EVENTS_ROUTE,
          language: 'de',
          city: 'augsburg',
          path: null,
          status: 'loading'
        }
      },
      languages: { status: 'loading' },
      resourceCache: { status: 'ready', progress: 0, value: {} },
      searchRoute: null,
      switchingLanguage: false
    })
  })

  it('should clear the event route on CLEAR_EVENT', () => {
    const prevState: CityContentStateType = {
      city: 'augsburg',
      routeMapping: {
        'route-id-0': {
          routeType: EVENTS_ROUTE,
          status: 'error',
          language: 'de',
          city: 'augsburg',
          path: null,
          message: 'No idea why it fails :/',
          code: ErrorCodes.UnknownError
        }
      },
      languages: { status: 'ready', models: languageModels },
      resourceCache: { status: 'ready', progress: 0, value: {} },
      searchRoute: null,
      switchingLanguage: false
    }

    expect(cityContentReducer(prevState, {
      type: 'CLEAR_EVENT',
      params: { key: 'route-id-0' }
    })?.routeMapping).toEqual({})
  })

  it('should set the route status to languageNotAvailable on FETCH_EVENT_FAILED with available languages', () => {
    const prevState: CityContentStateType = {
      city: 'augsburg',
      routeMapping: {
        'route-id-0': {
          routeType: EVENTS_ROUTE,
          status: 'loading',
          language: 'de',
          city: 'augsburg',
          path: null
        }
      },
      languages: { status: 'ready', models: languageModels },
      resourceCache: { status: 'ready', progress: 0, value: {} },
      searchRoute: null,
      switchingLanguage: false
    }

    expect(cityContentReducer(prevState, {
      type: 'FETCH_EVENT_FAILED',
      params: {
        message: 'Invalid language...',
        code: ErrorCodes.PageNotFound,
        key: 'route-id-0',
        path: null,
        allAvailableLanguages: new Map([['en', null]]),
        city: 'augsburg',
        language: 'de'
      }
    })?.routeMapping['route-id-0']).toEqual({
      routeType: EVENTS_ROUTE,
      status: 'languageNotAvailable',
      code: ErrorCodes.PageNotFound,
      language: 'de',
      city: 'augsburg',
      allAvailableLanguages: new Map([['en', null]])
    })
  })

  it('should pass the error to the corresponding route on FETCH_EVENT_FAILED', () => {
    const prevState: CityContentStateType = {
      city: 'augsburg',
      routeMapping: {
        'route-id-0': {
          routeType: EVENTS_ROUTE,
          status: 'loading',
          language: 'de',
          city: 'augsburg',
          path: null
        }
      },
      languages: { status: 'ready', models: languageModels },
      resourceCache: { status: 'ready', progress: 0, value: {} },
      searchRoute: null,
      switchingLanguage: false
    }

    expect(cityContentReducer(prevState, {
      type: 'FETCH_EVENT_FAILED',
      params: {
        key: 'route-id-0',
        message: 'No idea why it fails :/',
        code: ErrorCodes.UnknownError,
        path: null,
        city: 'augsburg',
        language: 'de',
        allAvailableLanguages: null
      }
    })?.routeMapping['route-id-0']).toEqual({
      routeType: EVENTS_ROUTE,
      status: 'error',
      language: 'de',
      city: 'augsburg',
      path: null,
      message: 'No idea why it fails :/',
      code: ErrorCodes.UnknownError
    })
  })

  it('should initialize cityContentState on FETCH_CATEGORY with loading route', () => {
    const action: FetchCategoryActionType = {
      type: 'FETCH_CATEGORY',
      params: {
        city: 'augsburg',
        language: 'de',
        path: '/augsburg/de',
        depth: 2,
        key: 'route-id-0',
        criterion: { forceUpdate: false, shouldRefreshResources: false }
      }
    }

    expect(cityContentReducer(null, action)).toEqual({
      routeMapping: {
        'route-id-0': {
          routeType: CATEGORIES_ROUTE,
          city: 'augsburg',
          depth: 2,
          language: 'de',
          path: '/augsburg/de',
          status: 'loading'
        }
      },
      city: 'augsburg',
      languages: { status: 'loading' },
      resourceCache: { status: 'ready', progress: 0, value: {} },
      searchRoute: null,
      switchingLanguage: false
    })
  })

  it('should clear the category route on CLEAR_CATEGORY', () => {
    const prevState: CityContentStateType = {
      city: 'augsburg',
      routeMapping: {
        'route-id-0': {
          routeType: CATEGORIES_ROUTE,
          status: 'error',
          language: 'de',
          depth: 2,
          city: 'augsburg',
          path: '/augsburg/de',
          message: 'No idea why it fails :/',
          code: ErrorCodes.UnknownError
        }
      },
      languages: { status: 'ready', models: languageModels },
      resourceCache: { status: 'ready', progress: 0, value: {} },
      searchRoute: null,
      switchingLanguage: false
    }

    expect(cityContentReducer(prevState, {
      type: 'CLEAR_CATEGORY',
      params: { key: 'route-id-0' }
    })?.routeMapping).toEqual({})
  })

  it('should set route status to languageNotAvailable on FETCH_CATEGORY_FAILED if allAvailableLanguages is not null',
    () => {
      const prevState: CityContentStateType = {
        city: 'augsburg',
        routeMapping: {
          'route-id-0': {
            routeType: CATEGORIES_ROUTE,
            status: 'loading',
            language: 'de',
            path: '/augsburg/de',
            depth: 2,
            city: 'augsburg'
          }
        },
        languages: { status: 'ready', models: languageModels },
        resourceCache: { status: 'ready', progress: 0, value: {} },
        searchRoute: null,
        switchingLanguage: false
      }
      expect(cityContentReducer(prevState, {
        type: 'FETCH_CATEGORY_FAILED',
        params: {
          key: 'route-id-0',
          allAvailableLanguages: new Map([['en', '/augsburg/en']]),
          message: 'Language not available.',
          code: ErrorCodes.PageNotFound,
          city: 'augsburg',
          language: 'de',
          path: '/augsburg/de',
          depth: 2
        }
      })?.routeMapping['route-id-0']).toEqual({
        routeType: CATEGORIES_ROUTE,
        status: 'languageNotAvailable',
        language: 'de',
        allAvailableLanguages: new Map([['en', '/augsburg/en']]),
        city: 'augsburg',
        depth: 2
      })
    })

  it('should pass the error to the corresponding route on FETCH_CATEGORY_FAILED', () => {
    const prevState: CityContentStateType = {
      city: 'augsburg',
      routeMapping: {
        'route-id-0': {
          routeType: CATEGORIES_ROUTE,
          status: 'loading',
          language: 'de',
          path: '/augsburg/de',
          depth: 2,
          city: 'augsburg'
        }
      },
      languages: { status: 'ready', models: languageModels },
      resourceCache: { status: 'ready', progress: 0, value: {} },
      searchRoute: null,
      switchingLanguage: false
    }

    expect(cityContentReducer(prevState, {
      type: 'FETCH_CATEGORY_FAILED',
      params: {
        key: 'route-id-0',
        message: 'No idea why it fails :/',
        code: ErrorCodes.UnknownError,
        path: '/augsburg/de',
        city: 'augsburg',
        allAvailableLanguages: null,
        language: 'de',
        depth: 2
      }
    })?.routeMapping['route-id-0']).toEqual({
      routeType: CATEGORIES_ROUTE,
      status: 'error',
      language: 'de',
      path: '/augsburg/de',
      city: 'augsburg',
      depth: 2,
      message: 'No idea why it fails :/',
      code: ErrorCodes.UnknownError
    })
  })

  it('should clear the cityContentState on CLEAR_CITY', () => {
    const prevState = {
      city: 'augsburg',
      routeMapping: {},
      languages: { status: 'ready', models: languageModels },
      resourceCache: { status: 'ready', progress: 0, value: {} },
      searchRoute: null,
      switchingLanguage: false
    }
    expect(cityContentReducer(prevState, { type: 'CLEAR_CITY' })).toBeNull()
  })

  it('should set progress for the resourceCache on FETCH_RESOURCES_PROGRESS', () => {
    prevState = {
      ...prevState,
      resourceCache: { status: 'ready', progress: 0.1, value: {} }
    }

    expect(cityContentReducer(prevState, {
      type: 'FETCH_RESOURCES_PROGRESS',
      params: { progress: 0.2 }
    })?.resourceCache).toEqual({ status: 'ready', progress: 0.2, value: {} })
  })

  it('should set an errorState for the resourceCache on FETCH_RESOURCES_FAILED', () => {
    expect(cityContentReducer(prevState, {
      type: 'FETCH_RESOURCES_FAILED',
      params: { message: 'No idea why it fails :/', code: ErrorCodes.UnknownError }
    })?.resourceCache).toEqual({ status: 'error', message: 'No idea why it fails :/', code: ErrorCodes.UnknownError })
  })
})
