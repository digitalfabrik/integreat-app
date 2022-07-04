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
  NewsType,
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
  FEEDBACK_MODAL_ROUTE,
  CITY_NOT_COOPERATING_ROUTE,
  CityNotCooperatingRouteType
} from 'api-client'

import { FeedbackInformationType } from '../components/FeedbackContainer'

export type RoutesType =
  | RedirectRouteType
  | JpalTrackingRouteType
  | IntroRouteType
  | LandingRouteType
  | CityNotCooperatingRouteType
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
type BasicParams = {
  shareUrl?: string
}

export type RoutesParamsType = {
  [REDIRECT_ROUTE]: BasicParams & {
    url: string
  }
  [INTRO_ROUTE]: BasicParams & {
    deepLink?: string
  }
  [LANDING_ROUTE]: undefined
  [CITY_NOT_COOPERATING_ROUTE]: undefined
  [DASHBOARD_ROUTE]: BasicParams
  [CATEGORIES_ROUTE]: BasicParams
  [POIS_ROUTE]: BasicParams & {
    urlSlug?: string
  }
  [EVENTS_ROUTE]: BasicParams
  [NEWS_ROUTE]: BasicParams &
    CityContentParamsType & {
      newsId: string | null
      newsType: NewsType
    }
  [DISCLAIMER_ROUTE]: BasicParams & CityContentParamsType
  [OFFERS_ROUTE]: BasicParams & CityContentParamsType
  [JPAL_TRACKING_ROUTE]: BasicParams & {
    trackingCode: string | null
    disableTracking?: boolean
  }
  [EXTERNAL_OFFER_ROUTE]: BasicParams & {
    url: string
    postData: Map<string, string> | null | undefined
  }
  [SPRUNGBRETT_OFFER_ROUTE]: BasicParams & CityContentParamsType
  [SETTINGS_ROUTE]: undefined
  [SEARCH_ROUTE]: undefined
  [CHANGE_LANGUAGE_MODAL_ROUTE]: BasicParams & {
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
  [FEEDBACK_MODAL_ROUTE]: BasicParams & FeedbackInformationType
}
export type RoutePropType<T extends RoutesType> = RouteProp<RoutesParamsType, T>
export type NavigationPropType<T extends RoutesType> = StackNavigationProp<RoutesParamsType, T>
