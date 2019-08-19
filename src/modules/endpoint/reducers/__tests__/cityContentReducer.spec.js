// @flow

import type { CityContentActionType } from '../../../app/StoreActionType'
import { CategoriesMapModel, LanguageModel } from '@integreat-app/integreat-api-client'
import cityContentReducer from '../cityContentReducer'
import type { CityContentStateType } from '../../../app/StateType'
import morphContentLanguage from '../morphContentLanguage'

describe('cityContentReducer', () => {
  const switchContentLanguageAction = {
    type: 'SWITCH_CONTENT_LANGUAGE',
    params: { newLanguage: 'de', city: 'augsburg' }
  }
  const pushLanguagesAction = { type: 'PUSH_LANGUAGES', params: { languages: [new LanguageModel('de', 'Deutsch')] } }
  const pushCategoryAction = {
    type: 'PUSH_CATEGORY',
    params: {
      categoriesMap: new CategoriesMapModel([]),
      resourceCache: {},
      rootAvailableLanguages: new Map(),
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
      languages: [],
      language: 'de'
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
      switchingLanguage: true
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
      switchingLanguage: true
    }
    expect(cityContentReducer(prevState, pushLanguagesAction)?.languages).toEqual(pushLanguagesAction.params.languages)
  })

  jest.mock('../morphContentLanguage', () => jest.fn(() => 'mockReturn'))
  it('should call morphContentLanguage on MORPH_CONTENT_LANGUAGE', () => {
    const prevState: CityContentStateType = {
      city: 'augsburg',
      categoriesRouteMapping: {},
      eventsRouteMapping: {},
      languages: null,
      resourceCache: {},
      searchRoute: null,
      switchingLanguage: true
    }
    expect(cityContentReducer(prevState, morphContentLanguageAction)).toBe('mockReturn')
    expect(morphContentLanguage).toHaveBeenCalledWith(prevState, morphContentLanguageAction)
  })
})
