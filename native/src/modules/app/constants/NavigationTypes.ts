import type { StackNavigationProp } from '@react-navigation/stack'
import type { RouteProp } from '@react-navigation/native'
import type {
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
  WohnenOfferRouteType
} from 'api-client'
import { LanguageModel } from 'api-client'
import type { FeedbackInformationType } from '../../feedback/FeedbackContainer'
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
  | WohnenOfferRouteType
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
  redirect: {
    url: string
  }
  intro: {
    deepLink?: string
  }
  landing: void
  dashboard: void
  categories: void
  pois: void
  events: void
  news: void
  disclaimer: CityContentParamsType
  offers: CityContentParamsType
  jpal: {
    trackingCode: string | null
  }
  externalOffer: ShareUrlType & {
    url: string
    postData: Map<string, string> | null | undefined
  }
  sprungbrett: CityContentParamsType
  wohnen: {
    offerHash: string | null | undefined
    city: string
    title: string
    alias: string
    postData: Map<string, string> | null | undefined
  }
  settings: void
  search: void
  changeLanguage: {
    currentLanguage: string
    previousKey: string
    cityCode: string
    languages: Array<LanguageModel>
    availableLanguages: Array<string>
  }
  pdf: ShareUrlType & {
    url: string
  }
  image: ShareUrlType & {
    url: string
  }
  feedback: FeedbackInformationType
}
export type RoutePropType<T extends RoutesType> = RouteProp<RoutesParamsType, T>
export type NavigationPropType<T extends RoutesType> = StackNavigationProp<RoutesParamsType, T>
