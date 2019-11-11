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
  switch (action.type) {
    case 'SWITCH_CONTENT_LANGUAGE':
      if (state === null) {
        throw Error('Cannot switch contentLanguage on not initialized cityContent')
      }
      return { ...state, switchingLanguage: true }
    case 'SWITCH_CONTENT_LANGUAGE_FAILED':
      if (state === null) {
        throw Error('A content language switch cannot fail if the state is not yet initialized')
      }
      return { ...state, switchingLanguage: false }
    case 'PUSH_LANGUAGES':
      if (state === null) {
        throw Error('Cannot push languages on not initialized cityContent')
      }
      return { ...state, languages: action.params.languages }
    case 'PUSH_CATEGORY':
      if (state === null) {
        // throw Error('Cannot push category on not initialized cityContent')
        return null
      }
      return pushCategory(state, action)
    case 'PUSH_EVENT':
      if (state === null) {
        // throw Error('Cannot push event on not initialized cityContent')
        return null
      }
      return pushEvent(state, action)
    case 'MORPH_CONTENT_LANGUAGE':
      if (state === null) {
        throw Error('Cannot morph content language on not initialized cityContent')
      }
      return morphContentLanguage(state, action)
    case 'FETCH_EVENT': {
      const { language, path, key, city } = action.params
      const initializedState = state || createCityContent(city)
      return {
        ...initializedState,
        eventsRouteMapping: {
          ...initializedState.eventsRouteMapping,
          [key]: { status: 'loading', language, city, path }
        }
      }
    }
    case 'CLEAR_EVENT': {
      const { key } = action.params
      if (state === null) {
        return null
      }
      return {
        ...state,
        eventsRouteMapping: omit(state.eventsRouteMapping, [key])
      }
    }
    case 'FETCH_EVENT_FAILED': {
      if (state === null) {
        throw Error('A fetch category fail cannot occur on not initialized cityContent')
      }
      const { message, key, path, allAvailableLanguages, ...rest } = action.params
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
    case 'FETCH_CATEGORY': {
      const { language, path, depth, key, city } = action.params
      const initializedState = state || createCityContent(city)
      return {
        ...initializedState,
        categoriesRouteMapping: {
          ...initializedState.categoriesRouteMapping,
          [key]: { status: 'loading', language, depth, path, city }
        }
      }
    }
    case 'CLEAR_CATEGORY': {
      const { key } = action.params
      if (state === null) {
        return null
      }
      return {
        ...state,
        categoriesRouteMapping: omit(state.categoriesRouteMapping, [key])
      }
    }
    case 'FETCH_CATEGORY_FAILED': {
      if (state === null) {
        throw Error('A fetch category fail cannot occur on not initialized cityContent')
      }
      const { message, key, allAvailableLanguages, path, ...rest } = action.params
      return {
        ...state,
        categoriesRouteMapping: {
          ...state.categoriesRouteMapping,
          [key]: allAvailableLanguages
            ? { status: 'languageNotAvailable', allAvailableLanguages, ...rest }
            : { status: 'error', message, path, ...rest }
        }
      }
    }
    case 'CLEAR_CITY':
      return null
    case 'FETCH_RESOURCES_FAILED': {
      if (state === null) {
        throw Error('A fetch resources fail cannot occur on not initialized cityContent')
      }
      const errorMessage: string = action.params.message
      return { ...state, resourceCache: { status: 'error', message: errorMessage } }
    }
    default:
      return state
  }
}
