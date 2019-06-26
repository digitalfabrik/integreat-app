// @flow

import type { CityContentStateType } from '../../app/StateType'
import type { SetCityContentLocalizationType } from '../../app/StoreActionType'

const setCityContentLocalization = (
  state: CityContentStateType | null, action: SetCityContentLocalizationType
): CityContentStateType => {
  const { language, city } = action.params
  if (state === null) {
    return {
      language,
      city,
      languages: null,
      categoriesRouteMapping: {},
      eventsRouteMapping: {},
      resourceCache: {},
      searchRoute: null
    }
  }
  return { ...state, language, city }
}

export default setCityContentLocalization
