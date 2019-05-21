// @flow

import type { CityContentStateType } from '../../app/StateType'
import { defaultCityContentState } from '../../app/StateType'
import morphContentLanguage from './morphContentLanguage'
import pushCategory from './pushCategory'
import pushEvent from './pushEvent'
import type { CityContentActionType } from '../../app/StoreActionType'
import setCityContentInformation from './setCityContentInformation'
import fetchCategoryFailed from './fetchCategoryFailed'
import fetchEventFailed from './fetchEventFailed'

export default (
  state: CityContentStateType = defaultCityContentState, action: CityContentActionType
): CityContentStateType => {
  switch (action.type) {
    case 'SET_CITY_CONTENT_INFORMATION':
      return setCityContentInformation(state, action)
    case 'PUSH_LANGUAGES':
      return {...state, languages: action.params.languages}
    case 'PUSH_CATEGORY':
      return pushCategory(state, action)
    case 'PUSH_EVENT':
      return pushEvent(state, action)
    case 'MORPH_CONTENT_LANGUAGE':
      return morphContentLanguage(state, action)
    case 'FETCH_EVENT':
    case 'CLEAR_EVENT': {
      const {key} = action.params
      delete state.eventsRouteMapping[key]
      return state
    }
    case 'FETCH_EVENT_FAILED':
      return fetchEventFailed(state, action)
    case 'FETCH_CATEGORY':
    case 'CLEAR_CATEGORY': {
      const {key} = action.params
      delete state.categoriesRouteMapping[key]
      return state
    }
    case 'FETCH_CATEGORY_FAILED':
      return fetchCategoryFailed(state, action)
    case 'CLEAR_CITY_CONTENT':
      return defaultCityContentState
    default:
      return state
  }
}
