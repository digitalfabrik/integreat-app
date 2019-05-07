// @flow

import { createSelector } from 'reselect'
import type {
  CategoryRouteStateType, EventRouteStateType,
  StateType
} from '../../app/StateType'

const cityLanguagesSelector = (state: StateType): ?Array<string> => state.cityContent.languages &&
  state.cityContent.languages.map(languageModel => languageModel.code)

const categoryRouteSelector = (state: StateType, ownProps): ?CategoryRouteStateType =>
  state.cityContent.categoriesRouteMapping[ownProps.navigation.getParam('key')]

const eventRouteSelector = (state: StateType, ownProps): ?EventRouteStateType =>
  state.cityContent.eventsRouteMapping[ownProps.navigation.getParam('key')]

export const availableLanguagesSelector = createSelector<StateType, any, ?Array<string>, ?CategoryRouteStateType, ?EventRouteStateType, ?Array<string>>(
  categoryRouteSelector,
  eventRouteSelector,
  cityLanguagesSelector,
  (categoryRoute: ?CategoryRouteStateType, eventRoute: ?EventRouteStateType, cityLanguages: ?Array<string>): ?Array<string> => {
    if (categoryRoute) {
      return Array.from(categoryRoute.allAvailableLanguages.keys())
    } else if (eventRoute) {
      return Array.from(eventRoute.allAvailableLanguages.keys())
    } else {
      return cityLanguages
    }
  }
)
