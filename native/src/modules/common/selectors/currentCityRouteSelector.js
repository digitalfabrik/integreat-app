// @flow

import type {
  CategoryRouteStateType,
  CityContentStateType,
  EventRouteStateType,
  PoiRouteStateType
} from '../../app/StateType'
import { createSelector } from 'reselect'

export type CityRouteSelectorPropsType = {|
  routeKey: string
|}

const categoryRouteSelector = (
  state: CityContentStateType,
  props: CityRouteSelectorPropsType
): ?CategoryRouteStateType => {
  return state.categoriesRouteMapping[props.routeKey]
}

const eventRouteSelector = (state: CityContentStateType, props: CityRouteSelectorPropsType): ?EventRouteStateType => {
  return state.eventsRouteMapping[props.routeKey]
}

const poiRouteSelector = (state: CityContentStateType, props: CityRouteSelectorPropsType): ?PoiRouteStateType => {
  return state.poisRouteMapping[props.routeKey]
}

export const currentCityRouteSelector = createSelector<
    CityContentStateType,
    CityRouteSelectorPropsType,
    EventRouteStateType | CategoryRouteStateType | PoiRouteStateType | null,
    ?CategoryRouteStateType,
    ?EventRouteStateType,
    ?PoiRouteStateType
  >(
    categoryRouteSelector,
    eventRouteSelector,
    poiRouteSelector, (
      categoryRoute: ?CategoryRouteStateType, eventRoute: ?EventRouteStateType, poiRoute: ?PoiRouteStateType
    ): CategoryRouteStateType | EventRouteStateType | PoiRouteStateType | null => {
      return categoryRoute || eventRoute || poiRoute || null
    }
  )
