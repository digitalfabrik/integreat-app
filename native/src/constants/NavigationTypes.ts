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
  BOTTOM_TAB_NAVIGATION_ROUTE,
  BottomTabNavigationRouteType,
  CATEGORIES_TAB_ROUTE,
  CategoriesTabRouteType,
  EVENTS_TAB_ROUTE,
  EventsTabRouteType,
  POIS_TAB_ROUTE,
  PoisTabRouteType,
  NEWS_TAB_ROUTE,
  NewsTabRouteType,
} from 'shared'
import { LanguageModel, FeedbackRouteType } from 'shared/api'

import { NavigatorIds } from './index'

export type NestedRoutesType = CategoriesRouteType | PoisRouteType | EventsRouteType | NewsRouteType

export type TabRoutesType = CategoriesTabRouteType | EventsTabRouteType | PoisTabRouteType | NewsTabRouteType

export type RootRoutesType =
  | RedirectRouteType
  | JpalTrackingRouteType
  | IntroRouteType
  | LandingRouteType
  | CityNotCooperatingRouteType
  | DisclaimerRouteType
  | SettingsRouteType
  | SearchRouteType
  | ChangeLanguageModalRouteType
  | PdfViewModalRouteType
  | ImageViewModalRouteType
  | FeedbackModalRouteType
  | LicensesRouteType
  | ConsentRouteType
  | BottomTabNavigationRouteType

export type RoutesType = RootRoutesType | TabRoutesType | NestedRoutesType

type RouteTitle = {
  title?: string
}

export type NestedRoutesParamsType = {
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
}

export type TabRoutesParamsType = {
  [CATEGORIES_TAB_ROUTE]: { screen: CategoriesRouteType; params: NestedRoutesParamsType[CategoriesRouteType] }
  [EVENTS_TAB_ROUTE]: { screen: EventsRouteType; params: NestedRoutesParamsType[EventsRouteType] }
  [POIS_TAB_ROUTE]: { screen: PoisRouteType; params: NestedRoutesParamsType[PoisRouteType] }
  [NEWS_TAB_ROUTE]: { screen: NewsRouteType; params: NestedRoutesParamsType[NewsRouteType] }
}

export type RootRoutesParamsType = {
  [REDIRECT_ROUTE]: {
    url: string
  }
  [INTRO_ROUTE]: {
    deepLink?: string
  }
  [LANDING_ROUTE]: undefined
  [CITY_NOT_COOPERATING_ROUTE]: undefined
  [DISCLAIMER_ROUTE]: undefined
  [CONSENT_ROUTE]: undefined
  [JPAL_TRACKING_ROUTE]: undefined
  [SETTINGS_ROUTE]: undefined
  [SEARCH_ROUTE]: {
    searchText?: string | null
  }
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
  [BOTTOM_TAB_NAVIGATION_ROUTE]: { screen: TabRoutesType; params: TabRoutesParamsType[TabRoutesType] }
}

export type RoutesParamsType = NestedRoutesParamsType & TabRoutesParamsType & RootRoutesParamsType
export type RouteProps<T extends RoutesType> = RouteProp<RoutesParamsType, T>
export type NavigationProps<T extends RoutesType> = StackNavigationProp<RoutesParamsType, T, NavigatorIds>
