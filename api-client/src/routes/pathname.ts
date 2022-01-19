import {
  JPAL_TRACKING_ROUTE,
  OFFERS_ROUTE,
  SPRUNGBRETT_OFFER_ROUTE,
  CATEGORIES_ROUTE,
  EVENTS_ROUTE,
  POIS_ROUTE,
  NEWS_ROUTE,
  DASHBOARD_ROUTE,
  DISCLAIMER_ROUTE,
  SEARCH_ROUTE,
  LANDING_ROUTE,
  CITY_NOT_COOPERATING_ROUTE
} from '.'
import { NonNullableRouteInformationType } from '..'

type CityContentRouteUrlType = {
  cityCode: string
  languageCode: string
  route?: string
  path?: string | null | undefined
}

const constructPathname = (parts: Array<string | null | undefined>) => {
  const pathname = parts
    .filter(Boolean)
    .map(part => part?.toLowerCase())
    .join('/')
  return pathname.startsWith('/') ? pathname : `/${pathname}`
}

export const cityContentPath = ({ cityCode, languageCode, route, path }: CityContentRouteUrlType): string =>
  constructPathname([cityCode, languageCode, route, path])

export const pathnameFromRouteInformation = (routeInformation: NonNullableRouteInformationType): string => {
  if (routeInformation.route === JPAL_TRACKING_ROUTE) {
    // https://integreat.app/jpal
    return constructPathname([routeInformation.route])
  }
  if (routeInformation.route === CITY_NOT_COOPERATING_ROUTE) {
    // https://integreat.app/jpal
    return constructPathname([CITY_NOT_COOPERATING_ROUTE, routeInformation.languageCode])
  }
  if (routeInformation.route === SPRUNGBRETT_OFFER_ROUTE) {
    const { cityCode, languageCode, route } = routeInformation
    // https://integreat.app/augsburg/de/offers/sprungbrett
    return constructPathname([cityCode, languageCode, OFFERS_ROUTE, route])
  }
  if (
    routeInformation.route === DASHBOARD_ROUTE ||
    routeInformation.route === CATEGORIES_ROUTE ||
    routeInformation.route === EVENTS_ROUTE ||
    routeInformation.route === POIS_ROUTE
  ) {
    if (routeInformation.cityContentPath) {
      // https://integreat.app/augsburg/de/, https://integreat.app/augsburg/de/events/12345
      return constructPathname([routeInformation.cityContentPath])
    }
    // https://integreat.app/augsburg/de/events, https://integreat.app/augsburg/de/pois
    return constructPathname([routeInformation.cityCode, routeInformation.languageCode, routeInformation.route])
  }
  if (
    routeInformation.route === DISCLAIMER_ROUTE ||
    routeInformation.route === OFFERS_ROUTE ||
    routeInformation.route === SEARCH_ROUTE ||
    routeInformation.route === NEWS_ROUTE
  ) {
    // https://integreat.app/augsburg/de/offers, https://integreat.app/augsburg/de/search, ...
    const { cityCode, languageCode } = routeInformation
    const newsType = routeInformation.route === NEWS_ROUTE ? routeInformation.newsType : null
    const newsId = routeInformation.route === NEWS_ROUTE ? routeInformation.newsId : null
    return constructPathname([cityCode, languageCode, routeInformation.route, newsType, newsId])
  }
  // https://integreat.app/landing/de
  return constructPathname([LANDING_ROUTE, routeInformation.languageCode])
}
