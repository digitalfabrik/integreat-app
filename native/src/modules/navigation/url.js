// @flow

import buildConfig from '../app/constants/buildConfig'
import Url from 'url-parse'
import type { RouteInformationType } from 'api-client'
import { JPAL_TRACKING_ROUTE, OFFERS_ROUTE, SPRUNGBRETT_OFFER_ROUTE } from 'api-client'

type CityContentRouteUrlType = {| cityCode: string, languageCode: string, route?: string, path?: ?string |}

const constructUrl = (parts: Array<?string>) => {
  const url = new Url(`https://${buildConfig().hostName}`)
  const pathname = parts
    .filter(Boolean)
    .map(part => part.toLowerCase())
    .join('/')
  url.set('pathname', pathname)
  return url
}

export const cityContentUrl = ({ cityCode, languageCode, route, path }: CityContentRouteUrlType): string => {
  const url = constructUrl([cityCode, languageCode, route, path])
  return url.href
}

export const cityContentPath = ({ cityCode, languageCode, route, path }: CityContentRouteUrlType): string => {
  const url = constructUrl([cityCode, languageCode, route, path])
  return url.pathname
}

export const url = (pathname?: string): string => {
  const url = constructUrl([pathname])
  return url.href
}

export const urlFromRouteInformation = (routeInformation: RouteInformationType): string => {
  const { route } = routeInformation
  if (route === JPAL_TRACKING_ROUTE) {
    // https://integreat.app/jpal
    return url(route)
  } else if (route === SPRUNGBRETT_OFFER_ROUTE) {
    const { cityCode, languageCode } = routeInformation
    // https://integreat.app/augsburg/de/offers/sprungbrett
    return cityContentUrl({ cityCode, languageCode, route: OFFERS_ROUTE, path: route })
  } else if (routeInformation.cityContentPath) {
    // https://integreat.app/augsburg/de/, https://integreat.app/augsburg/de/events/12345
    return url(routeInformation.cityContentPath)
  } else if (routeInformation.cityCode) {
    // https://integreat.app/augsburg/de/offers, https://integreat.app/augsburg/de/search, ...
    const { cityCode, languageCode } = routeInformation
    const newsPath = [routeInformation.newsType || null, routeInformation.newsId || null].filter(Boolean).join('/')
    return cityContentUrl({ cityCode, languageCode, route, path: newsPath })
  } else {
    // https://integreat.app
    return url()
  }
}
