import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'

import {
  CategoriesRouteType,
  ChangeLanguageModalRouteType,
  DisclaimerRouteType,
  EventsRouteType,
  FeedbackModalRouteType,
  ImageViewModalRouteType,
  IntroRouteType,
  JpalTrackingRouteType,
  LandingRouteType,
  NewsRouteType,
  NewsType,
  PdfViewModalRouteType,
  PoisRouteType,
  RedirectRouteType,
  SearchRouteType,
  SettingsRouteType,
  POIS_ROUTE,
  CATEGORIES_ROUTE,
  LANDING_ROUTE,
  INTRO_ROUTE,
  REDIRECT_ROUTE,
  EVENTS_ROUTE,
  NEWS_ROUTE,
  DISCLAIMER_ROUTE,
  JPAL_TRACKING_ROUTE,
  SETTINGS_ROUTE,
  SEARCH_ROUTE,
  CHANGE_LANGUAGE_MODAL_ROUTE,
  PDF_VIEW_MODAL_ROUTE,
  IMAGE_VIEW_MODAL_ROUTE,
  FEEDBACK_MODAL_ROUTE,
  CITY_NOT_COOPERATING_ROUTE,
  CityNotCooperatingRouteType,
  LICENSES_ROUTE,
  LicensesRouteType,
  CONSENT_ROUTE,
  ConsentRouteType,
  MAIN_TABS_ROUTE,
  MainTabsRouteType,
} from 'shared'
import { LanguageModel, FeedbackRouteType } from 'shared/api'

export type RoutesType =
  | RedirectRouteType
  | JpalTrackingRouteType
  | IntroRouteType
  | LandingRouteType
  | CityNotCooperatingRouteType
  | CategoriesRouteType
  | PoisRouteType
  | EventsRouteType
  | NewsRouteType
  | DisclaimerRouteType
  | SettingsRouteType
  | SearchRouteType
  | ChangeLanguageModalRouteType
  | PdfViewModalRouteType
  | ImageViewModalRouteType
  | FeedbackModalRouteType
  | LicensesRouteType
  | ConsentRouteType
  | MainTabsRouteType

type RouteTitle = {
  title?: string
}

export type RoutesParamsType = {
  [REDIRECT_ROUTE]: {
    url: string
  }
  [INTRO_ROUTE]: {
    deepLink?: string
  }
  [LANDING_ROUTE]: undefined
  [CITY_NOT_COOPERATING_ROUTE]: undefined
  [CATEGORIES_ROUTE]: RouteTitle & {
    path?: string
  }
  [POIS_ROUTE]: RouteTitle & {
    slug?: string
    multipoi?: number
    poiCategoryId?: number
    zoom?: number
  }
  [EVENTS_ROUTE]: RouteTitle & {
    slug?: string
  }
  [NEWS_ROUTE]: RouteTitle & {
    newsId: number | null
    newsType: NewsType
  }
  [DISCLAIMER_ROUTE]: undefined
  [CONSENT_ROUTE]: undefined
  [JPAL_TRACKING_ROUTE]: undefined
  [SETTINGS_ROUTE]: undefined
  [SEARCH_ROUTE]: {
    searchText?: string | null
  }
  [MAIN_TABS_ROUTE]: undefined
  [LICENSES_ROUTE]: undefined
  [CHANGE_LANGUAGE_MODAL_ROUTE]: {
    languages: LanguageModel[]
    availableLanguages: string[]
  }
  [PDF_VIEW_MODAL_ROUTE]: {
    url: string
    shareUrl: string
  }
  [IMAGE_VIEW_MODAL_ROUTE]: {
    url: string
    shareUrl: string
  }
  [FEEDBACK_MODAL_ROUTE]: {
    routeType: FeedbackRouteType
    language: string
    cityCode: string
    slug?: string
  }
}
export type RouteProps<T extends RoutesType> = RouteProp<RoutesParamsType, T>
export type NavigationProps<T extends RoutesType> = StackNavigationProp<RoutesParamsType, T>
