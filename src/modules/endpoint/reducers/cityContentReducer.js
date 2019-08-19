// @flow

import type { CityContentStateType } from '../../app/StateType'
import { defaultCityContentState } from '../../app/StateType'
import morphContentLanguage from './morphContentLanguage'
import pushCategory from './pushCategory'
import pushEvent from './pushEvent'
import type { StoreActionType } from '../../app/StoreActionType'
import createCityContent from './createCityContent'

export default (
  state: CityContentStateType | null = defaultCityContentState, action: StoreActionType
): CityContentStateType | null => {
  switch (action.type) {
    case 'SWITCH_CONTENT_LANGUAGE':
      if (state === null) {
        throw Error('Cannot switch contentLanguage on not initialized cityContent')
      }
      return { ...state, switchingLanguage: true }
    case 'PUSH_LANGUAGES':
      if (state === null) {
        throw Error('Cannot push languages on not initialized cityContent')
      }
      return { ...state, languages: action.params.languages }
    case 'PUSH_CATEGORY':
      if (state === null) {
        throw Error('Cannot push category on not initialized cityContent')
      }
      return pushCategory(state, action)
    case 'PUSH_EVENT':
      if (state === null) {
        throw Error('Cannot push event on not initialized cityContent')
      }
      return pushEvent(state, action)
    case 'MORPH_CONTENT_LANGUAGE':
      if (state === null) {
        throw Error('Cannot morph content language on not initialized cityContent')
      }
      return morphContentLanguage(state, action)
    case 'FETCH_EVENT': {
      const { language, path, key, city } = action.params
      const newState = state === null ? createCityContent(city) : state
      newState.eventsRouteMapping[key] = { status: 'loading', language, city, path }
      return newState
    }
    case 'CLEAR_EVENT': {
      const { key } = action.params
      if (state === null) {
        return state
      }
      delete state.eventsRouteMapping[key]
      return state
    }
    case 'FETCH_EVENT_FAILED': {
      if (state === null) {
        throw Error('A fetch category fail cannot occur on not initialized cityContent')
      }
      const { message, key } = action.params
      const { language, path, city } = state.eventsRouteMapping[key]
      state.eventsRouteMapping[key] = { status: 'error', message, language, path, city }
      return state
    }
    case 'FETCH_CATEGORY': {
      const { language, path, depth, key, city } = action.params
      const newState = state === null ? createCityContent(city) : state
      newState.categoriesRouteMapping[key] = { status: 'loading', language, depth, path, city }
      return newState
    }
    case 'CLEAR_CATEGORY': {
      const { key } = action.params
      if (state === null) {
        return state
      }
      delete state.categoriesRouteMapping[key]
      return state
    }
    case 'FETCH_CATEGORY_FAILED': {
      if (state === null) {
        throw Error('A fetch category fail cannot occur on not initialized cityContent')
      }
      const { message, key } = action.params
      const { language, depth, path, city } = state.categoriesRouteMapping[key]
      state.categoriesRouteMapping[key] = { status: 'error', message, language, depth, path, city }
      return state
    }
    case 'CLEAR_CITY':
      return null
    case 'FETCH_RESOURCES_FAILED': {
      if (state === null) {
        throw Error('A fetch resources fail cannot occur on not initialized cityContent')
      }
      const errorMessage: string = action.params.message
      return { ...state, resourceCache: { errorMessage } }
    }
    default:
      return state
  }
}
