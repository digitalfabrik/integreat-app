// @flow

import type { CityContentStateType } from '../../app/StateType'
import type { InitializeCityContentActionType } from '../../app/StoreActionType'

const initializeCityContent = (
  state: CityContentStateType | null, action: InitializeCityContentActionType
): CityContentStateType => {
  const { city, languages } = action.params
  if (state === null) {
    return {
      city,
      languages,
      switchingLanguage: false,
      categoriesRouteMapping: {},
      eventsRouteMapping: {},
      resourceCache: {},
      searchRoute: null
    }
  }
  return state
}

export default initializeCityContent
