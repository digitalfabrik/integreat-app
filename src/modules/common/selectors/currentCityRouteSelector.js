// @flow

import type { CategoryRouteStateType, CityContentStateType, EventRouteStateType } from '../../app/StateType'
import { createSelector } from 'reselect'

export type CityRouteSelectorPropsType = {|
  routeKey: string
|}

const categoryRouteSelector = (state: CityContentStateType, props: CityRouteSelectorPropsType): ?CategoryRouteStateType => {
  return state.categoriesRouteMapping[props.routeKey]
}

const eventRouteSelector = (state: CityContentStateType, props: CityRouteSelectorPropsType): ?EventRouteStateType => {
  return state.eventsRouteMapping[props.routeKey]
}

export const currentCityRouteSelector = createSelector<CityContentStateType, CityRouteSelectorPropsType,
  EventRouteStateType | CategoryRouteStateType | null, ?CategoryRouteStateType, ?EventRouteStateType>(
    categoryRouteSelector,
    eventRouteSelector, (
      categoryRoute: ?CategoryRouteStateType, eventRoute: ?EventRouteStateType
    ): CategoryRouteStateType | EventRouteStateType | null => {
      return categoryRoute || eventRoute || null
    }
  )
