// @flow

import type { CategoryRouteStateType, EventRouteStateType, StateType } from '../../app/StateType'
import { createSelector } from 'reselect'

export type CityRouteSelectorPropsType = {|
  routeKey: string
|}

const categoryRouteSelector = (state: StateType, props: CityRouteSelectorPropsType): ?CategoryRouteStateType => {
  const route = state.cityContent.categoriesRouteMapping[props.routeKey]
  if (route && route.errorMessage === undefined) {
    return route
  }
}

const eventRouteSelector = (state: StateType, props: CityRouteSelectorPropsType): ?EventRouteStateType => {
  const route = state.cityContent.eventsRouteMapping[props.routeKey]
  if (route && route.errorMessage === undefined) {
    return route
  }
}

export const currentCityRouteSelector = createSelector<StateType, CityRouteSelectorPropsType,
  EventRouteStateType | CategoryRouteStateType | null, ?CategoryRouteStateType, ?EventRouteStateType>(
    categoryRouteSelector,
    eventRouteSelector,
    (categoryRoute: ?CategoryRouteStateType, eventRoute: ?EventRouteStateType): CategoryRouteStateType | EventRouteStateType | null => {
      return categoryRoute || eventRoute || null
    }
  )
