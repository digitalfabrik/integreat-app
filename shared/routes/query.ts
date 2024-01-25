import { POIS_ROUTE, SEARCH_ROUTE } from '.'

import { NonNullableRouteInformationType } from './RouteInformationTypes'

export const queryFromRouteInformation = (routeInformation: NonNullableRouteInformationType): string | undefined => {
  if (routeInformation.route === POIS_ROUTE && routeInformation.multipoi) {
    const { multipoi } = routeInformation
    return `?multipoi=${multipoi}`
  }
  if (routeInformation.route === SEARCH_ROUTE && routeInformation.searchText) {
    const { searchText } = routeInformation
    return `?query=${searchText}`
  }
  return undefined
}
