import {
  CATEGORIES_ROUTE,
  CITY_NOT_COOPERATING_ROUTE,
  CONSENT_ROUTE,
  DISCLAIMER_ROUTE,
  EVENTS_ROUTE,
  JPAL_TRACKING_ROUTE,
  LANDING_ROUTE,
  LICENSES_ROUTE,
  LOCAL_NEWS_TYPE,
  MAIN_DISCLAIMER_ROUTE,
  NEWS_ROUTE,
  NOT_FOUND_ROUTE,
  POIS_ROUTE,
  SEARCH_ROUTE,
  TU_NEWS_TYPE,
} from 'shared'

export const LOCAL_NEWS_ROUTE = LOCAL_NEWS_TYPE
export const TU_NEWS_ROUTE = TU_NEWS_TYPE
export const TU_NEWS_DETAIL_ROUTE = `${TU_NEWS_ROUTE}-detail` as const

const languageCodePattern = ':languageCode'
export const cityContentPattern = `/:cityCode/${languageCodePattern}/*`
export const RoutePatterns = {
  [LANDING_ROUTE]: `/${LANDING_ROUTE}/${languageCodePattern}`,
  [CITY_NOT_COOPERATING_ROUTE]: `/${CITY_NOT_COOPERATING_ROUTE}/${languageCodePattern}`,
  [MAIN_DISCLAIMER_ROUTE]: `/${MAIN_DISCLAIMER_ROUTE}/${languageCodePattern}`,
  [JPAL_TRACKING_ROUTE]: `/${JPAL_TRACKING_ROUTE}/${languageCodePattern}`,
  [NOT_FOUND_ROUTE]: `/${NOT_FOUND_ROUTE}/${languageCodePattern}`,
  [LICENSES_ROUTE]: `/${LICENSES_ROUTE}/${languageCodePattern}`,
  [CONSENT_ROUTE]: `/${CONSENT_ROUTE}/${languageCodePattern}`,

  // City content routes, relative to /:cityCode/:languageCode
  [EVENTS_ROUTE]: EVENTS_ROUTE,
  [POIS_ROUTE]: POIS_ROUTE,
  [LOCAL_NEWS_ROUTE]: `${NEWS_ROUTE}/${LOCAL_NEWS_ROUTE}`,
  [TU_NEWS_ROUTE]: `${NEWS_ROUTE}/${TU_NEWS_ROUTE}`,
  [TU_NEWS_DETAIL_ROUTE]: `${NEWS_ROUTE}/${TU_NEWS_ROUTE}/:newsId`,
  [SEARCH_ROUTE]: SEARCH_ROUTE,
  [DISCLAIMER_ROUTE]: DISCLAIMER_ROUTE,
  [CATEGORIES_ROUTE]: '*',
} as const

export type RouteType = keyof typeof RoutePatterns
