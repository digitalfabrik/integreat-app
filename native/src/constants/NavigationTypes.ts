import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'

import {
  CategoriesRouteType,
  ChangeLanguageModalRouteType,
  DisclaimerRouteType,
  EventsRouteType,
  ExternalOfferRouteType,
  FeedbackModalRouteType,
  ImageViewModalRouteType,
  IntroRouteType,
  JpalTrackingRouteType,
  LandingRouteType,
  NewsRouteType,
  NewsType,
  OffersRouteType,
  PdfViewModalRouteType,
  PoisRouteType,
  RedirectRouteType,
  SearchRouteType,
  SettingsRouteType,
  SprungbrettOfferRouteType,
  POIS_ROUTE,
  CATEGORIES_ROUTE,
  LANDING_ROUTE,
  INTRO_ROUTE,
  REDIRECT_ROUTE,
  EVENTS_ROUTE,
  NEWS_ROUTE,
  DISCLAIMER_ROUTE,
  OFFERS_ROUTE,
  JPAL_TRACKING_ROUTE,
  EXTERNAL_OFFER_ROUTE,
  SPRUNGBRETT_OFFER_ROUTE,
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
  MalteHelpFormOfferRouteType,
  MALTE_HELP_FORM_OFFER_ROUTE,
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
  | OffersRouteType
  | ExternalOfferRouteType
  | SprungbrettOfferRouteType
  | MalteHelpFormOfferRouteType
  | SettingsRouteType
  | SearchRouteType
  | ChangeLanguageModalRouteType
  | PdfViewModalRouteType
  | ImageViewModalRouteType
  | FeedbackModalRouteType
  | LicensesRouteType
  | ConsentRouteType

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
    newsId: string | null
    newsType: NewsType
  }
  [DISCLAIMER_ROUTE]: undefined
  [OFFERS_ROUTE]: undefined
  [CONSENT_ROUTE]: undefined
  [JPAL_TRACKING_ROUTE]: undefined
  [EXTERNAL_OFFER_ROUTE]: {
    url: string
    postData: Map<string, string> | null | undefined
  }
  [SPRUNGBRETT_OFFER_ROUTE]: undefined
  [MALTE_HELP_FORM_OFFER_ROUTE]: undefined
  [SETTINGS_ROUTE]: undefined
  [SEARCH_ROUTE]: {
    searchText?: string | null
  }
  [LICENSES_ROUTE]: undefined
  [CHANGE_LANGUAGE_MODAL_ROUTE]: {
    languages: Array<LanguageModel>
    availableLanguages: Array<string>
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
