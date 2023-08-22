import { POIS_ROUTE } from '.'

import { NonNullableRouteInformationType } from './RouteInformationTypes'

export const queryFromRouteInformation = (routeInformation: NonNullableRouteInformationType): string | undefined => {
  if (routeInformation.route === POIS_ROUTE && routeInformation.multipoi) {
    const { multipoi } = routeInformation
    return `?multipoi=${multipoi}`
  }
  return undefined
}
