import { useSelector } from 'react-redux'

import {
  CATEGORIES_ROUTE,
  CategoriesRouteType,
  EVENTS_ROUTE,
  EventsRouteType,
  POIS_ROUTE,
  PoisRouteType,
} from 'api-client'

import { CategoryRouteStateType, EventRouteStateType, PoiRouteStateType, StateType } from '../redux/StateType'

type RouteKeyTypes = CategoriesRouteType | EventsRouteType | PoisRouteType
type RouteTypes = {
  [CATEGORIES_ROUTE]: CategoryRouteStateType
  [EVENTS_ROUTE]: EventRouteStateType
  [POIS_ROUTE]: PoiRouteStateType
}

const useStateRoute = <T extends RouteKeyTypes>(routeKey: string, routeType: T): RouteTypes[T] | null =>
  useSelector<StateType, RouteTypes[T] | null>((state: StateType) => {
    const route = state.cityContent?.routeMapping[routeKey]
    return route?.routeType === routeType ? (route as RouteTypes[T]) : null
  })

export default useStateRoute
