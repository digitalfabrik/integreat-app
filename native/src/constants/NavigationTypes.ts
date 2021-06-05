import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
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
  LanguageModel
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
  redirect: {
    url: string
  }
  intro: {
    deepLink?: string
  }
  landing: undefined
  dashboard: undefined
  categories: undefined
  pois: undefined
  events: undefined
  news: undefined
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
  settings: undefined
  search: undefined
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
