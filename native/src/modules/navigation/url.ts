import buildConfig from '../app/constants/buildConfig'
import Url from 'url-parse'
import {
  JPAL_TRACKING_ROUTE,
  OFFERS_ROUTE,
  SPRUNGBRETT_OFFER_ROUTE,
  NonNullableRouteInformationType,
  CATEGORIES_ROUTE,
  EVENTS_ROUTE,
  POIS_ROUTE,
  NEWS_ROUTE,
  DASHBOARD_ROUTE,
  DISCLAIMER_ROUTE,
  SEARCH_ROUTE
} from 'api-client'
type CityContentRouteUrlType = {
  cityCode: string
  languageCode: string
  route?: string
  path?: string | null | undefined
}

const constructUrl = (parts: Array<string | null | undefined>) => {
  const url = new Url(`https://${buildConfig().hostName}`)
  const pathname = parts
    .filter(Boolean)
    .map(part => part?.toLowerCase())
    .join('/')
  url.set('pathname', pathname)
  return url
}

export const cityContentPath = ({ cityCode, languageCode, route, path }: CityContentRouteUrlType): string => {
  const url = constructUrl([cityCode, languageCode, route, path])
  return url.pathname
}

const constructUrlFromRouteInformation = (routeInformation: NonNullableRouteInformationType) => {
  if (routeInformation.route === JPAL_TRACKING_ROUTE) {
    // https://integreat.app/jpal
    return constructUrl([routeInformation.route])
  } else if (routeInformation.route === SPRUNGBRETT_OFFER_ROUTE) {
    const { cityCode, languageCode, route } = routeInformation
    // https://integreat.app/augsburg/de/offers/sprungbrett
    return constructUrl([cityCode, languageCode, OFFERS_ROUTE, route])
  } else if (routeInformation.route === DASHBOARD_ROUTE || routeInformation.route === CATEGORIES_ROUTE || routeInformation.route === EVENTS_ROUTE || routeInformation.route === POIS_ROUTE) {
    // https://integreat.app/augsburg/de/, https://integreat.app/augsburg/de/events/12345
    return constructUrl([routeInformation.cityContentPath])
  } else if (routeInformation.route === DISCLAIMER_ROUTE || routeInformation.route === OFFERS_ROUTE || routeInformation.route === SEARCH_ROUTE || routeInformation.route === NEWS_ROUTE) {
    // https://integreat.app/augsburg/de/offers, https://integreat.app/augsburg/de/search, ...
    const { cityCode, languageCode } = routeInformation
    const newsType = routeInformation.route === NEWS_ROUTE ? routeInformation.newsType : null
    const newsId = routeInformation.route === NEWS_ROUTE ? routeInformation.newsId : null
    return constructUrl([cityCode, languageCode, routeInformation.route, newsType, newsId])
  } else {
    // https://integreat.app
    return constructUrl([])
  }
}

export const urlFromRouteInformation = (routeInformation: NonNullableRouteInformationType): string => {
  const url = constructUrlFromRouteInformation(routeInformation)
  return url.href
}
export default urlFromRouteInformation
