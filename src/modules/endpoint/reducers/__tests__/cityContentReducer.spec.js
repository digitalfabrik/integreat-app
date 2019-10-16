// @flow

import type { CityContentActionType, FetchCategoryActionType, FetchEventActionType } from '../../../app/StoreActionType'
import { CategoriesMapModel, LanguageModel } from '@integreat-app/integreat-api-client'
import cityContentReducer from '../cityContentReducer'
import type { CityContentStateType } from '../../../app/StateType'

describe('cityContentReducer', () => {
  const switchContentLanguageAction = {
    type: 'SWITCH_CONTENT_LANGUAGE',
    params: { newLanguage: 'de', city: 'augsburg', t: key => key }
  }
  const pushLanguagesAction = { type: 'PUSH_LANGUAGES', params: { languages: [new LanguageModel('de', 'Deutsch')] } }
  const pushCategoryAction = {
    type: 'PUSH_CATEGORY',
    params: {
      categoriesMap: new CategoriesMapModel([]),
      resourceCache: {},
      cityLanguages: [new LanguageModel('de', 'Deutsch')],
      city: 'augsburg',
      language: 'de',
      path: '/augsburg/de',
      depth: 2,
      key: 'route-id-0'
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
      city: 'augsburg'
    }
  }
  const morphContentLanguageAction = {
    type: 'MORPH_CONTENT_LANGUAGE',
    params: {
      newCategoriesMap: new CategoriesMapModel([]),
      newResourceCache: {},
      newEvents: [],
      newLanguage: 'de'
    }
  }
  const fetchCategoryFailedAction = {
    type: 'FETCH_CATEGORY_FAILED',
    params: { key: 'route-id-0', message: 'Some error' }
  }
  const fetchEventFailedAction = { type: 'FETCH_EVENT_FAILED', params: { key: 'route-id-0', message: 'Some error' } }
  const fetchResourcesFailedAction = { type: 'FETCH_RESOURCES_FAILED', params: { message: 'Some error' } }

  const unsupportedActionsOnUnitializedState: Array<CityContentActionType> = [
    switchContentLanguageAction,
    pushLanguagesAction,
    pushCategoryAction,
    pushEventAction,
    morphContentLanguageAction,
    fetchCategoryFailedAction,
    fetchEventFailedAction,
    fetchResourcesFailedAction
  ]
  for (const action of unsupportedActionsOnUnitializedState) {
    it(`should throw on ${action.type} if state is unitialized`, () => {
      expect(() => cityContentReducer(null, action)).toThrow()
    })
  }

  it('should set switchingLanguage to true on SWITCH_CONTENT_LANGUAGE', () => {
    const prevState: CityContentStateType = {
      city: 'augsburg',
      categoriesRouteMapping: {},
      eventsRouteMapping: {},
      languages: [],
      resourceCache: {},
      searchRoute: null,
      switchingLanguage: false
    }
    expect(cityContentReducer(prevState, switchContentLanguageAction)?.switchingLanguage).toBe(true)
  })

  it('should set languages on PUSH_LANGUAGES', () => {
    const prevState: CityContentStateType = {
      city: 'augsburg',
      categoriesRouteMapping: {},
      eventsRouteMapping: {},
      languages: null,
      resourceCache: {},
      searchRoute: null,
      switchingLanguage: false
    }
    expect(cityContentReducer(prevState, pushLanguagesAction)?.languages).toEqual(pushLanguagesAction.params.languages)
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
      categoriesRouteMapping: {},
      city: 'augsburg',
      eventsRouteMapping: {
        'route-id-0': {
          language: 'de',
          city: 'augsburg',
          path: null,
          status: 'loading'
        }
      },
      languages: undefined,
      resourceCache: {},
      searchRoute: null,
      switchingLanguage: false
    })
  })

  it('should clear the event route on CLEAR_EVENT', () => {
    const prevState: CityContentStateType = {
      city: 'augsburg',
      categoriesRouteMapping: {},
      eventsRouteMapping: {
        'route-id-0': {
          status: 'error',
          language: 'de',
          city: 'augsburg',
          path: null,
          message: 'No idea why it fails :/'
        }
      },
      languages: ['de', 'en'],
      resourceCache: {},
      searchRoute: null,
      switchingLanguage: false
    }

    expect(cityContentReducer(prevState, {
      type: 'CLEAR_EVENT',
      params: { key: 'route-id-0' }
    })?.eventsRouteMapping).toEqual({})
  })

  it('should pass the error to the corresponding route on FETCH_EVENT_FAILED', () => {
    const prevState: CityContentStateType = {
      city: 'augsburg',
      categoriesRouteMapping: {},
      eventsRouteMapping: {
        'route-id-0': {
          status: 'loading',
          language: 'de',
          city: 'augsburg',
          path: null
        }
      },
      languages: ['de', 'en'],
      resourceCache: {},
      searchRoute: null,
      switchingLanguage: false
    }

    expect(cityContentReducer(prevState, {
      type: 'FETCH_EVENT_FAILED',
      params: { key: 'route-id-0', message: 'No idea why it fails :/' }
    })?.eventsRouteMapping['route-id-0']).toEqual({
      status: 'error',
      language: 'de',
      city: 'augsburg',
      path: null,
      message: 'No idea why it fails :/'
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
      categoriesRouteMapping: {
        'route-id-0': {
          city: 'augsburg', depth: 2, language: 'de', path: '/augsburg/de', status: 'loading'
        }
      },
      city: 'augsburg',
      eventsRouteMapping: {},
      languages: undefined,
      resourceCache: {},
      searchRoute: null,
      switchingLanguage: false
    })
  })

  it('should clear the category route on CLEAR_CATEGORY', () => {
    const prevState: CityContentStateType = {
      city: 'augsburg',
      categoriesRouteMapping: {
        'route-id-0': {
          status: 'error',
          language: 'de',
          depth: 2,
          city: 'augsburg',
          path: '/augsburg/de',
          message: 'No idea why it fails :/'
        }
      },
      eventsRouteMapping: {},
      languages: ['de', 'en'],
      resourceCache: {},
      searchRoute: null,
      switchingLanguage: false
    }

    expect(cityContentReducer(prevState, {
      type: 'CLEAR_CATEGORY',
      params: { key: 'route-id-0' }
    })?.categoriesRouteMapping).toEqual({})
  })

  it('should pass the error to the corresponding route on FETCH_CATEGORY_FAILED', () => {
    const prevState: CityContentStateType = {
      city: 'augsburg',
      categoriesRouteMapping: {
        'route-id-0': {
          status: 'loading',
          language: 'de',
          path: '/augsburg/de',
          depth: 2,
          city: 'augsburg'
        }
      },
      eventsRouteMapping: {},
      languages: ['de', 'en'],
      resourceCache: {},
      searchRoute: null,
      switchingLanguage: false
    }

    expect(cityContentReducer(prevState, {
      type: 'FETCH_CATEGORY_FAILED',
      params: { key: 'route-id-0', message: 'No idea why it fails :/' }
    })?.categoriesRouteMapping['route-id-0']).toEqual({
      status: 'error',
      language: 'de',
      path: '/augsburg/de',
      city: 'augsburg',
      depth: 2,
      message: 'No idea why it fails :/'
    })
  })

  it('should clear the cityContentState on CLEAR_CITY', () => {
    const prevState = {
      city: 'augsburg',
      categoriesRouteMapping: {},
      eventsRouteMapping: {},
      languages: [],
      resourceCache: {},
      searchRoute: null,
      switchingLanguage: false
    }
    expect(cityContentReducer(prevState, { type: 'CLEAR_CITY' })).toBeNull()
  })

  it('should set an errorState for the resourceCache on FETCH_RESOURCES_FAILED', () => {
    const prevState = {
      city: 'augsburg',
      categoriesRouteMapping: {},
      eventsRouteMapping: {},
      languages: [],
      resourceCache: {},
      searchRoute: null,
      switchingLanguage: false
    }

    expect(cityContentReducer(prevState, {
      type: 'FETCH_RESOURCES_FAILED',
      params: { message: 'No idea why it fails :/' }
    })?.resourceCache).toEqual({ errorMessage: 'No idea why it fails :/' })
  })
})
