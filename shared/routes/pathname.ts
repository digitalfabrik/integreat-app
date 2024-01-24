import {
  CATEGORIES_ROUTE,
  CITY_NOT_COOPERATING_ROUTE,
  CONSENT_ROUTE,
  DISCLAIMER_ROUTE,
  EVENTS_ROUTE,
  JPAL_TRACKING_ROUTE,
  LANDING_ROUTE,
  LICENSES_ROUTE,
  NEWS_ROUTE,
  OFFERS_ROUTE,
  POIS_ROUTE,
  SEARCH_ROUTE,
  SPRUNGBRETT_OFFER_ROUTE,
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
  if (
    routeInformation.route === JPAL_TRACKING_ROUTE ||
    routeInformation.route === LICENSES_ROUTE ||
    routeInformation.route === CONSENT_ROUTE
  ) {
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
  if (routeInformation.route === CATEGORIES_ROUTE) {
    // https://integreat.app/augsburg/de/, https://integreat.app/augsburg/de/willkommen/erste-schritte
    return constructPathname([routeInformation.cityContentPath])
  }
  if (routeInformation.route === EVENTS_ROUTE || routeInformation.route === POIS_ROUTE) {
    const { cityCode, languageCode, route, slug } = routeInformation
    // https://integreat.app/augsburg/de/locations, https://integreat.app/augsburg/de/events/my-event-1234
    return constructPathname([cityCode, languageCode, route, slug])
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
