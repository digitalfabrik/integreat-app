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
  LanguageModel,
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
} from 'api-client'

import { FeedbackInformationType } from '../components/FeedbackContainer'

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
  | SettingsRouteType
  | SearchRouteType
  | ChangeLanguageModalRouteType
  | PdfViewModalRouteType
  | ImageViewModalRouteType
  | FeedbackModalRouteType

export type RoutesParamsType = {
  [REDIRECT_ROUTE]: {
    url: string
  }
  [INTRO_ROUTE]: {
    deepLink?: string
  }
  [LANDING_ROUTE]: undefined
  [CITY_NOT_COOPERATING_ROUTE]: undefined
  [CATEGORIES_ROUTE]: {
    path?: string
  }
  [POIS_ROUTE]: {
    slug?: string
  }
  [EVENTS_ROUTE]: {
    slug?: string
  }
  [NEWS_ROUTE]: {
    newsId: string | null
    newsType: NewsType
  }
  [DISCLAIMER_ROUTE]: undefined
  [OFFERS_ROUTE]: undefined
  [JPAL_TRACKING_ROUTE]: undefined
  [EXTERNAL_OFFER_ROUTE]: {
    url: string
    postData: Map<string, string> | null | undefined
  }
  [SPRUNGBRETT_OFFER_ROUTE]: undefined
  [SETTINGS_ROUTE]: undefined
  [SEARCH_ROUTE]: undefined
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
  [FEEDBACK_MODAL_ROUTE]: FeedbackInformationType
}
export type RouteProps<T extends RoutesType> = RouteProp<RoutesParamsType, T>
export type NavigationProps<T extends RoutesType> = StackNavigationProp<RoutesParamsType, T>
