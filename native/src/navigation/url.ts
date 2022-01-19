import Url from 'url-parse'

import { NonNullableRouteInformationType, pathnameFromRouteInformation } from 'api-client'

import buildConfig from '../constants/buildConfig'

export const urlFromRouteInformation = (routeInformation: NonNullableRouteInformationType): string => {
  const url = new Url(`https://${buildConfig().hostName}`)
  url.set('pathname', pathnameFromRouteInformation(routeInformation))
  return url.href
}
export default urlFromRouteInformation
