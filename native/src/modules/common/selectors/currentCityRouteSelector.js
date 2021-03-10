// @flow

import type {
  CityContentStateType,
  RouteStateType
} from '../../app/StateType'
import { createSelector } from 'reselect'

export type CityRouteSelectorPropsType = {|
  routeKey: string
|}

const routeSelector = (state: CityContentStateType, props: CityRouteSelectorPropsType): RouteStateType => {
  return state.routeMapping[props.routeKey]
}

export const currentCityRouteSelector = createSelector<
    CityContentStateType,
    CityRouteSelectorPropsType,
    RouteStateType,
  RouteStateType
  >(
    routeSelector, (route): RouteStateType => {
      return route
    }
  )
