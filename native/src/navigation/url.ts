import Url from 'url-parse'

import { NonNullableRouteInformationType, pathnameFromRouteInformation, queryStringFromRouteInformation } from 'shared'

import buildConfig from '../constants/buildConfig'

export const urlFromRouteInformation = (routeInformation: NonNullableRouteInformationType): string => {
  const url = new Url(`https://${buildConfig().hostName}`)
  url.set('pathname', pathnameFromRouteInformation(routeInformation))
  url.set('query', queryStringFromRouteInformation(routeInformation))
  return url.href
}
export default urlFromRouteInformation
