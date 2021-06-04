import {
  CATEGORIES_ROUTE,
  DISCLAIMER_ROUTE,
  EVENTS_ROUTE,
  LANDING_ROUTE,
  LOCAL_NEWS_TYPE,
  MAIN_DISCLAIMER_ROUTE,
  NEWS_ROUTE,
  NOT_FOUND_ROUTE,
  OFFERS_ROUTE,
  POIS_ROUTE,
  SEARCH_ROUTE,
  SPRUNGBRETT_OFFER_ROUTE,
  TU_NEWS_TYPE
} from 'api-client'
import { ExtractRouteParams } from 'react-router'
import { generatePath } from 'react-router-dom'

export const cityContentPattern = `/:cityCode/:languageCode`
export const RoutePatterns = {
  [LANDING_ROUTE]: `/${LANDING_ROUTE}/:languageCode`,
  [MAIN_DISCLAIMER_ROUTE]: `/${MAIN_DISCLAIMER_ROUTE}`,
  [NOT_FOUND_ROUTE]: `/${NOT_FOUND_ROUTE}`,

  [EVENTS_ROUTE]: `${cityContentPattern}/${EVENTS_ROUTE}/:eventId?`,
  [SPRUNGBRETT_OFFER_ROUTE]: `${cityContentPattern}/${OFFERS_ROUTE}/${SPRUNGBRETT_OFFER_ROUTE}`,
  [OFFERS_ROUTE]: `${cityContentPattern}/${OFFERS_ROUTE}`,
  [POIS_ROUTE]: `${cityContentPattern}/${POIS_ROUTE}/:poiId?`,
  [LOCAL_NEWS_TYPE]: `${cityContentPattern}/${NEWS_ROUTE}/${LOCAL_NEWS_TYPE}/:newsId?`,
  [TU_NEWS_TYPE]: `${cityContentPattern}/${NEWS_ROUTE}/${TU_NEWS_TYPE}/:newsId?`,
  [SEARCH_ROUTE]: `${cityContentPattern}/${SEARCH_ROUTE}`,
  [DISCLAIMER_ROUTE]: `${cityContentPattern}/${DISCLAIMER_ROUTE}`,
  [CATEGORIES_ROUTE]: `${cityContentPattern}/:categoryId*`
} as const

export type RouteType = keyof typeof RoutePatterns
export type RoutePatternType = typeof RoutePatterns[keyof typeof RoutePatterns]

export const createPath = <S extends RouteType>(route: S, params?: ExtractRouteParams<typeof RoutePatterns[S]>): string => {
  return generatePath(RoutePatterns[route], params)
}

