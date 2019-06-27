// @flow

import { createSelector } from 'reselect'
import type {
  CategoryRouteStateType, EventRouteStateType,
  StateType
} from '../../app/StateType'
import { currentCityRouteSelector } from './currentCityRouteSelector'
import type { CityRouteSelectorPropsType } from './currentCityRouteSelector'

const cityLanguagesSelector = (state: StateType): ?Array<string> => {
  if (state.cityContent && state.cityContent.languages) {
    return state.cityContent.languages.map(languageModel => languageModel.code)
  }
}

export const availableLanguagesSelector = createSelector<StateType, CityRouteSelectorPropsType, ?Array<string>,
  CategoryRouteStateType | EventRouteStateType | null, ?Array<string>>(
    currentCityRouteSelector,
    cityLanguagesSelector,
    (route: CategoryRouteStateType | EventRouteStateType | null, cityLanguages: ?Array<string>): ?Array<string> => {
      if (route) {
        return Array.from(route.allAvailableLanguages.keys())
      } else {
        return cityLanguages
      }
    }
  )
