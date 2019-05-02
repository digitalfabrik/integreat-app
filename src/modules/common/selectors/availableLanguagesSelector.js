// @flow

import { createSelector } from 'reselect'
import type {
  CategoryRouteStateType, EventRouteStateType,
  StateType
} from '../../app/StateType'
import { CategoryModel, EventModel } from '@integreat-app/integreat-api-client'

const cityLanguagesSelector = (state: StateType): ?Array<string> => state.cityContent.languages &&
  state.cityContent.languages.map(languageModel => languageModel.code)

const categoryRouteSelector = (state: StateType, ownProps): ?CategoryRouteStateType =>
  state.cityContent.categoriesRouteMapping[ownProps.navigation.getParam('key')]

const eventRouteSelector = (state: StateType, ownProps): ?EventRouteStateType =>
  state.cityContent.eventsRouteMapping[ownProps.navigation.getParam('key')]

const categoryModelSelector = createSelector(
  categoryRouteSelector,
  (route: ?CategoryRouteStateType): ?CategoryModel => route && route.root && route.models[route.root]
)

const eventModelSelector = createSelector(
  eventRouteSelector,
  (route: ?EventRouteStateType): ?EventModel => route && route.path && route.models[route.path]
)

export const availableLanguagesSelector = createSelector(
  categoryModelSelector,
  eventModelSelector,
  cityLanguagesSelector,
  (categoryModel: ?CategoryModel, eventModel: ?EventModel, cityLanguages: ?Array<string>): ?Array<string> => {
    if (categoryModel && !categoryModel.isRoot()) {
      return Array.from(categoryModel.availableLanguages.keys())
    } else if (eventModel) {
      return Array.from(eventModel.availableLanguages.keys())
    } else {
      return cityLanguages
    }
  }
)
