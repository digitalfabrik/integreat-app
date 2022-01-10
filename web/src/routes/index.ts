import { ExtractRouteParams } from 'react-router'
import { RouteComponentProps } from 'react-router-dom'

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

export const LOCAL_NEWS_ROUTE = LOCAL_NEWS_TYPE
export const TU_NEWS_ROUTE = TU_NEWS_TYPE
export const TU_NEWS_DETAIL_ROUTE = `${TU_NEWS_ROUTE}-detail` as const

export const cityContentPattern = `/:cityCode/:languageCode`
export const RoutePatterns = {
  [LANDING_ROUTE]: `/${LANDING_ROUTE}/:languageCode`,
  [MAIN_DISCLAIMER_ROUTE]: `/${MAIN_DISCLAIMER_ROUTE}`,
  [NOT_FOUND_ROUTE]: `/${NOT_FOUND_ROUTE}`,

  [EVENTS_ROUTE]: `${cityContentPattern}/${EVENTS_ROUTE}/:eventId?`,
  [SPRUNGBRETT_OFFER_ROUTE]: `${cityContentPattern}/${OFFERS_ROUTE}/${SPRUNGBRETT_OFFER_ROUTE}`,
  [OFFERS_ROUTE]: `${cityContentPattern}/${OFFERS_ROUTE}`,
  [POIS_ROUTE]: `${cityContentPattern}/${POIS_ROUTE}/:poiId?`,
  [LOCAL_NEWS_ROUTE]: `${cityContentPattern}/${NEWS_ROUTE}/${LOCAL_NEWS_ROUTE}/:newsId?`,
  [TU_NEWS_ROUTE]: `${cityContentPattern}/${NEWS_ROUTE}/${TU_NEWS_ROUTE}`,
  [TU_NEWS_DETAIL_ROUTE]: `${cityContentPattern}/${NEWS_ROUTE}/${TU_NEWS_ROUTE}/:newsId`,
  [SEARCH_ROUTE]: `${cityContentPattern}/${SEARCH_ROUTE}`,
  [DISCLAIMER_ROUTE]: `${cityContentPattern}/${DISCLAIMER_ROUTE}`,
  [CATEGORIES_ROUTE]: `${cityContentPattern}/:categoryId*`
} as const

export type RouteType = keyof typeof RoutePatterns

type ExtractedParams<S extends RouteType> = ExtractRouteParams<typeof RoutePatterns[S], string>
type ExpectedParams<S extends RouteType> = ExtractedParams<S> extends { [K in keyof ExtractedParams<S>]?: string }
  ? ExtractedParams<S>
  : never
export type RouteProps<S extends RouteType> = RouteComponentProps<ExpectedParams<S>>
