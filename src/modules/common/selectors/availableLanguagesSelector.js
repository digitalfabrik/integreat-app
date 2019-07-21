// @flow

import { createSelector } from 'reselect'
import type {
  CategoryRouteStateType, CityContentStateType, EventRouteStateType
} from '../../app/StateType'
import { currentCityRouteSelector } from './currentCityRouteSelector'
import type { CityRouteSelectorPropsType } from './currentCityRouteSelector'

const cityLanguagesSelector = (state: CityContentStateType): Array<string> =>
  state.languages.map(languageModel => languageModel.code)

export const availableLanguagesSelector = createSelector<CityContentStateType, CityRouteSelectorPropsType, Array<string>,
  CategoryRouteStateType | EventRouteStateType | null, Array<string>>(
    currentCityRouteSelector,
    cityLanguagesSelector,
    (route: CategoryRouteStateType | EventRouteStateType | null, cityLanguages: Array<string>): Array<string> => {
      if (route && route.status === 'ready') {
        return Array.from(route.allAvailableLanguages.keys())
      } else {
        return cityLanguages
      }
    }
  )
