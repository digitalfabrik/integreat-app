// @flow

import type { CategoryRouteStateType, EventRouteStateType, StateType } from '../../app/StateType'
import { createSelector } from 'reselect'

export type CityRouteSelectorPropsType = {|
  routeKey: string
|}

const categoryRouteSelector = (state: StateType, props: CityRouteSelectorPropsType): ?CategoryRouteStateType =>
  state.cityContent.categoriesRouteMapping[props.routeKey]

const eventRouteSelector = (state: StateType, props: CityRouteSelectorPropsType): ?EventRouteStateType =>
  state.cityContent.eventsRouteMapping[props.routeKey]

export const currentCityRouteSelector = createSelector<StateType, CityRouteSelectorPropsType,
  EventRouteStateType | CategoryRouteStateType | null, ?CategoryRouteStateType, ?EventRouteStateType>(
    categoryRouteSelector,
    eventRouteSelector,
    (categoryRoute: ?CategoryRouteStateType, eventRoute: ?EventRouteStateType): CategoryRouteStateType | EventRouteStateType | null => {
      return categoryRoute || eventRoute || null
    }
  )
