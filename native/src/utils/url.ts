import Url from 'url-parse'

import {
  CATEGORIES_ROUTE,
  NonNullableRouteInformationType,
  pathnameFromRouteInformation,
  queryStringFromRouteInformation,
  regionContentPath,
} from 'shared'

import buildConfig from '../constants/buildConfig'

export const urlFromRouteInformation = (routeInformation: NonNullableRouteInformationType): string => {
  const url = new Url(`https://${buildConfig().hostName}`)
  url.set('pathname', pathnameFromRouteInformation(routeInformation))
  url.set('query', queryStringFromRouteInformation(routeInformation))
  return url.href
}

export const getChatUrl = ({
  regionCode,
  languageCode,
  chatId,
}: {
  regionCode: string
  languageCode: string
  chatId?: string
}): string =>
  urlFromRouteInformation({
    route: CATEGORIES_ROUTE,
    regionCode,
    languageCode,
    chat: true,
    chatId,
    regionContentPath: regionContentPath({ regionCode, languageCode }),
  })

export default urlFromRouteInformation
