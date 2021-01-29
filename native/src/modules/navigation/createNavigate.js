// @flow

import type { StoreActionType } from '../app/StoreActionType'
import type { Dispatch } from 'redux'
import {
  CATEGORIES_ROUTE,
  DASHBOARD_ROUTE,
  DISCLAIMER_ROUTE,
  EVENTS_ROUTE,
  LANDING_ROUTE, LOCAL_NEWS_TYPE,
  NEWS_ROUTE, OFFERS_ROUTE, POIS_ROUTE, SEARCH_ROUTE
} from 'api-client/src/routes'
import navigateToDisclaimer from './navigateToDisclaimer'
import navigateToLanding from './navigateToLanding'
import navigateToOffers from './navigateToOffers'
import navigateToEvents from './navigateToEvents'
import navigateToPois from './navigateToPois'
import navigateToSearch from './navigateToSearch'
import navigateToNews from './navigateToNews'
import navigateToCategory from './navigateToCategory'
import type {
  CategoriesRouteType,
  DashboardRouteType,
  DisclaimerRouteType,
  EventsRouteType,
  LandingRouteType,
  LocalNewsType,
  NewsRouteType,
  OffersRouteType,
  PoisRouteType,
  SearchRouteType,
  SprungbrettOfferRouteType,
  TuNewsType,
  WohnenOfferRouteType
} from 'api-client/src/routes'
import type { NavigationPropType, RoutesType } from '../app/constants/NavigationTypes'

type ParamsType = {|
  cityCode: string,
  languageCode: string
|}

export type LandingRouteInformationType = {|
  route: LandingRouteType,
  languageCode: string
|}

export type CategoriesRouteInformationType = {|
  route: DashboardRouteType | CategoriesRouteType,
  cityContentPath: string,
  ...ParamsType
|}
export type NewsRouteInformationType = {| // Two levels of ids: news type and news id
  route: NewsRouteType,
  newsType: LocalNewsType | TuNewsType,
  newsId?: string,
  ...ParamsType
|}
export type SimpleCityContentFeatureType = {| // Routes without customizable ids, e.g. '/augsburg/de/disclaimer/
  route: DisclaimerRouteType | OffersRouteType | SprungbrettOfferRouteType | WohnenOfferRouteType | SearchRouteType,
  ...ParamsType
|}
export type EventsPoisRouteInformationType = {| // Routes with customizable ids, e.g. '/augsburg/de/pois/1234/
  route: EventsRouteType | PoisRouteType,
  cityContentPath?: string,
  ...ParamsType
|}

export type RouteInformationType = LandingRouteInformationType
  | CategoriesRouteInformationType
  | NewsRouteInformationType
  | SimpleCityContentFeatureType
  | EventsPoisRouteInformationType
  | null

const createNavigate = <T: RoutesType>(
  dispatch: Dispatch<StoreActionType>,
  navigation: NavigationPropType<T>
) => (
    routeInformation: RouteInformationType,
    key?: string,
    forceRefresh?: boolean
  ) => {
    if (routeInformation) {
      if (routeInformation.route === LANDING_ROUTE) {
        navigateToLanding({ dispatch, navigation })
        return
      }

      const { route, cityCode, languageCode } = routeInformation
      const cityContentPath = routeInformation.cityContentPath || null
      const params = { dispatch, navigation, cityCode, languageCode }

      switch (route) {
        case CATEGORIES_ROUTE:
        case DASHBOARD_ROUTE:
          if (!cityContentPath) {
            break
          }
          navigateToCategory({
            dispatch,
            navigation,
            routeName: route === CATEGORIES_ROUTE ? CATEGORIES_ROUTE : DASHBOARD_ROUTE,
            cityCode,
            languageCode,
            cityContentPath,
            key,
            forceRefresh
          })
          return
        case DISCLAIMER_ROUTE:
          navigateToDisclaimer(params)
          return
        case EVENTS_ROUTE:
          navigateToEvents({ ...params, cityContentPath, key, forceRefresh })
          return
        case NEWS_ROUTE:
          navigateToNews({
            ...params,
            type: routeInformation.newsType || LOCAL_NEWS_TYPE,
            newsId: routeInformation.newsId || null,
            key,
            forceRefresh
          })
          return
        case OFFERS_ROUTE:
          navigateToOffers(params)
          return
        case POIS_ROUTE:
          navigateToPois({ ...params, cityContentPath, key, forceRefresh })
          return
        case SEARCH_ROUTE:
          navigateToSearch(params)
          return
      }
    }

    console.warn('This is not a supported route. Skipping.')
    // TODO Show a snackbar
  }

export default createNavigate
