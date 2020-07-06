// @flow

import type { CityContentStateType } from '../../app/StateType'
import { defaultCityContentState } from '../../app/StateType'
import morphContentLanguage from './morphContentLanguage'
import pushCategory from './pushCategory'
import pushEvent from './pushEvent'
import type { StoreActionType } from '../../app/StoreActionType'
import createCityContent from './createCityContent'
import { omit } from 'lodash'

export default (
  state: CityContentStateType | null = defaultCityContentState, action: StoreActionType
): CityContentStateType | null => {
  if (action.type === 'FETCH_CATEGORY') {
    const { language, path, depth, key, city } = action.params
    const initializedState = state || createCityContent(city)
    return {
      ...initializedState,
      categoriesRouteMapping: {
        ...initializedState.categoriesRouteMapping,
        [key]: { status: 'loading', language, depth, path, city }
      }
    }
  } else if (action.type === 'FETCH_EVENT') {
    const { language, path, key, city } = action.params
    const initializedState = state || createCityContent(city)
    return {
      ...initializedState,
      eventsRouteMapping: {
        ...initializedState.eventsRouteMapping,
        [key]: { status: 'loading', language, city, path }
      }
    }
  } else {
    if (state === null) {
      return null
    }

    switch (action.type) {
      case 'SWITCH_CONTENT_LANGUAGE':
        return { ...state, switchingLanguage: true, searchRoute: null }
      case 'SWITCH_CONTENT_LANGUAGE_FAILED':
        return { ...state, switchingLanguage: false }
      case 'PUSH_LANGUAGES':
        return { ...state, languages: { status: 'ready', models: action.params.languages } }
      case 'FETCH_LANGUAGES_FAILED':
        return { ...state, languages: { status: 'error', ...action.params } }
      case 'PUSH_CATEGORY':
        return pushCategory(state, action)
      case 'PUSH_EVENT':
        return pushEvent(state, action)
      case 'MORPH_CONTENT_LANGUAGE':
        return morphContentLanguage(state, action)
      case 'CLEAR_EVENT': {
        const { key } = action.params
        return {
          ...state,
          eventsRouteMapping: omit(state.eventsRouteMapping, [key])
        }
      }
      case 'FETCH_EVENT_FAILED': {
        const { message, key, allAvailableLanguages, path, ...rest } = action.params
        return {
          ...state,
          eventsRouteMapping: {
            ...state.eventsRouteMapping,
            [key]: allAvailableLanguages
              ? { status: 'languageNotAvailable', allAvailableLanguages, ...rest }
              : { status: 'error', message, path, ...rest }
          }
        }
      }
      case 'CLEAR_CATEGORY': {
        const { key } = action.params
        return {
          ...state,
          categoriesRouteMapping: omit(state.categoriesRouteMapping, [key])
        }
      }
      case 'FETCH_CATEGORY_FAILED': {
        const { message, code, key, allAvailableLanguages, path, ...rest } = action.params
        return {
          ...state,
          categoriesRouteMapping: {
            ...state.categoriesRouteMapping,
            [key]: allAvailableLanguages
              ? { status: 'languageNotAvailable', allAvailableLanguages, ...rest }
              : { status: 'error', message, code, path, ...rest }
          }
        }
      }
      case 'CLEAR_CITY':
      case 'CLEAR_RESOURCES_AND_CACHE':
        return null
      case 'FETCH_RESOURCES_FAILED': {
        const { message, code } = action.params
        return { ...state, resourceCache: { status: 'error', message, code } }
      }
      default:
        return state
    }
  }
}
