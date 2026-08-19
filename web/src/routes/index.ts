import {
  CATEGORIES_ROUTE,
  SUGGEST_TO_REGION_ROUTE,
  CONSENT_ROUTE,
  IMPRINT_ROUTE,
  EVENTS_ROUTE,
  REGIONS_ROUTE,
  LICENSES_ROUTE,
  MAIN_IMPRINT_ROUTE,
  NEWS_ROUTE,
  NOT_FOUND_ROUTE,
  PLACES_ROUTE,
  SEARCH_ROUTE,
} from 'shared'
import { RegionModel } from 'shared/api'

export const NEWS_DETAIL_ROUTE = `${NEWS_ROUTE}-detail` as const

const languageCodePattern = ':languageCode'
export const regionContentPattern = `/:regionCode/${languageCodePattern}/*`
export const RoutePatterns = {
  [REGIONS_ROUTE]: `/${REGIONS_ROUTE}/${languageCodePattern}`,
  [SUGGEST_TO_REGION_ROUTE]: `/${SUGGEST_TO_REGION_ROUTE}/${languageCodePattern}`,
  [MAIN_IMPRINT_ROUTE]: `/${MAIN_IMPRINT_ROUTE}/${languageCodePattern}`,
  [NOT_FOUND_ROUTE]: `/${NOT_FOUND_ROUTE}/${languageCodePattern}`,
  [LICENSES_ROUTE]: `/${LICENSES_ROUTE}/${languageCodePattern}`,
  [CONSENT_ROUTE]: `/${CONSENT_ROUTE}/${languageCodePattern}`,

  // Region content routes, relative to /:regionCode/:languageCode
  [EVENTS_ROUTE]: EVENTS_ROUTE,
  [PLACES_ROUTE]: PLACES_ROUTE,
  [NEWS_ROUTE]: NEWS_ROUTE,
  [NEWS_DETAIL_ROUTE]: `${NEWS_ROUTE}/:id`,
  [SEARCH_ROUTE]: SEARCH_ROUTE,
  [IMPRINT_ROUTE]: IMPRINT_ROUTE,
  [CATEGORIES_ROUTE]: '*',
} as const

export type RouteType = keyof typeof RoutePatterns

export type RegionRouteProps = {
  region: RegionModel | null
  pathname: string
  regionCode: string
  languageCode: string
}
