import {
  CATEGORIES_ROUTE,
  DISCLAIMER_ROUTE,
  DisclaimerRouteType,
  EVENTS_ROUTE,
  EventsRouteType,
  LANDING_ROUTE,
  LandingRouteType,
  LOCAL_NEWS_TYPE,
  LocalNewsType,
  MAIN_DISCLAIMER_ROUTE,
  MainDisclaimerRouteType,
  NEWS_ROUTE,
  NewsRouteType,
  NOT_FOUND_ROUTE,
  NotFoundRouteType,
  OFFERS_ROUTE,
  OffersRouteType,
  POIS_ROUTE,
  PoisRouteType,
  SEARCH_ROUTE,
  SearchRouteType,
  SPRUNGBRETT_OFFER_ROUTE,
  SprungbrettOfferRouteType,
  TU_NEWS_TYPE,
  TuNewsType
} from 'api-client'

export const cityContentPattern = `/:cityCode/:languageCode`
type cityContentPatternType = typeof cityContentPattern
export const RoutePatterns = {
  [LANDING_ROUTE]: `/${LANDING_ROUTE}/:languageCode` as `/${LandingRouteType}/:languageCode`,
  [MAIN_DISCLAIMER_ROUTE]: `/${MAIN_DISCLAIMER_ROUTE}` as `/${MainDisclaimerRouteType}`,
  [NOT_FOUND_ROUTE]: `/${NOT_FOUND_ROUTE}` as `/${NotFoundRouteType}`,

  [EVENTS_ROUTE]: `${cityContentPattern}/${EVENTS_ROUTE}/:eventId?` as `${cityContentPatternType}/${EventsRouteType}:eventId?`,
  [SPRUNGBRETT_OFFER_ROUTE]: `${cityContentPattern}/${OFFERS_ROUTE}/${SPRUNGBRETT_OFFER_ROUTE}` as `${cityContentPatternType}/${OffersRouteType}/${SprungbrettOfferRouteType}`,
  [OFFERS_ROUTE]: `${cityContentPattern}/${OFFERS_ROUTE}` as `${cityContentPatternType}/${OffersRouteType}`,
  [POIS_ROUTE]: `${cityContentPattern}/${POIS_ROUTE}/:poiId?` as `${cityContentPatternType}/${PoisRouteType}:poiId?`,
  [LOCAL_NEWS_TYPE]: `${cityContentPattern}/${NEWS_ROUTE}/${LOCAL_NEWS_TYPE}/:newsId?` as `${cityContentPatternType}/${NewsRouteType}/${LocalNewsType}/:newsId?`,
  [TU_NEWS_TYPE]: `${cityContentPattern}/${NEWS_ROUTE}/${TU_NEWS_TYPE}/:newsId?` as `${cityContentPatternType}/${NewsRouteType}/${TuNewsType}/:newsId?`,
  [SEARCH_ROUTE]: `${cityContentPattern}/${SEARCH_ROUTE}` as `${cityContentPatternType}/${SearchRouteType}`,
  [DISCLAIMER_ROUTE]: `${cityContentPattern}/${DISCLAIMER_ROUTE}` as `${cityContentPatternType}/${DisclaimerRouteType}`,
  [CATEGORIES_ROUTE]: `${cityContentPattern}/:categoryId*` as `${cityContentPatternType}/:categoryId*`
}
export type RouteType = keyof typeof RoutePatterns
export type RoutePatternType = typeof RoutePatterns[keyof typeof RoutePatterns]
