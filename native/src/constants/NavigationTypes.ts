import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'

import {
  CategoriesRouteType,
  ChangeLanguageModalRouteType,
  DashboardRouteType,
  DisclaimerRouteType,
  EventsRouteType,
  ExternalOfferRouteType,
  FeedbackModalRouteType,
  ImageViewModalRouteType,
  IntroRouteType,
  JpalTrackingRouteType,
  LandingRouteType,
  NewsRouteType,
  OffersRouteType,
  PdfViewModalRouteType,
  PoisRouteType,
  RedirectRouteType,
  SearchRouteType,
  SettingsRouteType,
  SprungbrettOfferRouteType,
  LanguageModel,
  POIS_ROUTE,
  CATEGORIES_ROUTE,
  DASHBOARD_ROUTE,
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
  FEEDBACK_MODAL_ROUTE
} from 'api-client'

import { FeedbackInformationType } from '../components/FeedbackContainer'

export type RoutesType =
  | RedirectRouteType
  | JpalTrackingRouteType
  | IntroRouteType
  | LandingRouteType
  | DashboardRouteType
  | CategoriesRouteType
  | PoisRouteType
  | EventsRouteType
  | NewsRouteType
  | DisclaimerRouteType
  | OffersRouteType
  | ExternalOfferRouteType
  | SprungbrettOfferRouteType
  | SettingsRouteType
  | SearchRouteType
  | ChangeLanguageModalRouteType
  | PdfViewModalRouteType
  | ImageViewModalRouteType
  | FeedbackModalRouteType
type ShareUrlType = {
  shareUrl: string
}
type CityContentParamsType = {
  cityCode: string
  languageCode: string
}

export type RoutesParamsType = {
  [REDIRECT_ROUTE]: {
    url: string
  }
  [INTRO_ROUTE]: {
    deepLink?: string
  }
  [LANDING_ROUTE]: undefined
  [DASHBOARD_ROUTE]: undefined
  [CATEGORIES_ROUTE]: undefined
  [POIS_ROUTE]: {
    locationId?: string
  }
  [EVENTS_ROUTE]: undefined
  [NEWS_ROUTE]: undefined
  [DISCLAIMER_ROUTE]: CityContentParamsType
  [OFFERS_ROUTE]: CityContentParamsType
  [JPAL_TRACKING_ROUTE]: {
    trackingCode: string | null
  }
  [EXTERNAL_OFFER_ROUTE]: ShareUrlType & {
    url: string
    postData: Map<string, string> | null | undefined
  }
  [SPRUNGBRETT_OFFER_ROUTE]: CityContentParamsType
  [SETTINGS_ROUTE]: undefined
  [SEARCH_ROUTE]: undefined
  [CHANGE_LANGUAGE_MODAL_ROUTE]: {
    currentLanguage: string
    previousKey: string
    cityCode: string
    languages: Array<LanguageModel>
    availableLanguages: Array<string>
  }
  [PDF_VIEW_MODAL_ROUTE]: ShareUrlType & {
    url: string
  }
  [IMAGE_VIEW_MODAL_ROUTE]: ShareUrlType & {
    url: string
  }
  [FEEDBACK_MODAL_ROUTE]: FeedbackInformationType
}
export type RoutePropType<T extends RoutesType> = RouteProp<RoutesParamsType, T>
export type NavigationPropType<T extends RoutesType> = StackNavigationProp<RoutesParamsType, T>
