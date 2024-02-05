import { POIS_ROUTE, SEARCH_ROUTE } from '.'

import { NonNullableRouteInformationType } from './RouteInformationTypes'

export const MULTIPOI_QUERY_KEY = 'multipoi'
export const SEARCH_QUERY_KEY = 'query'

export const queryFromRouteInformation = (routeInformation: NonNullableRouteInformationType): string | undefined => {
  if (routeInformation.route === POIS_ROUTE && routeInformation.multipoi) {
    const { multipoi } = routeInformation
    return `?${MULTIPOI_QUERY_KEY}=${multipoi}`
  }
  if (routeInformation.route === SEARCH_ROUTE && routeInformation.searchText) {
    const { searchText } = routeInformation
    return `?${SEARCH_QUERY_KEY}=${searchText}`
  }
  return undefined
}
