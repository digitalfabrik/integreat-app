// @flow

import type { StackNavigationProp } from '@react-navigation/stack'
import type { RouteProp } from '@react-navigation/native'
import { LanguageModel, OfferModel } from 'api-client'
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
  LandingRouteType,
  NewsRouteType,
  OffersRouteType,
  PdfViewModalRouteType,
  PoisRouteType,
  SearchRouteType,
  SettingsRouteType,
  SprungbrettOfferRouteType,
  WohnenOfferRouteType
} from 'api-client/src/routes'
import type { FeedbackInformationType } from '../../../routes/feedback/containers/FeedbackModalContainer'

export type RoutesType = IntroRouteType
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

type ShareUrlType = {| shareUrl: string |}

export type RoutesParamsType = {|
  intro: void,
  landing: void,
  dashboard: {| ...ShareUrlType, cityCode: string, languageCode: string |},
  categories: {| ...ShareUrlType, cityCode: string, languageCode: string |},
  pois: ShareUrlType,
  events: ShareUrlType,
  news: ShareUrlType,
  disclaimer: {| ...ShareUrlType, cityCode: string, languageCode: string |},
  offers: {| ...ShareUrlType, cityCode: string, languageCode: string |},
  externalOffer: {| ...ShareUrlType, url: string, postData: ?Map<string, string> |},
  sprungbrett: {| ...ShareUrlType, cityCode: string, languageCode: string, offers: Array<OfferModel> |},
  wohnen: {| offerHash: ?string, city: string, offers: Array<OfferModel> |},
  settings: void,
  search: void,
  changeLanguage: {|
    currentLanguage: string,
    previousKey: string,
    cityCode: string,
    languages: Array<LanguageModel>,
    availableLanguages: Array<string>
  |},
  pdf: {| url: string, ...ShareUrlType |},
  image: {| url: string, ...ShareUrlType |},
  feedback: FeedbackInformationType
|}

export type RoutePropType<T: RoutesType> = RouteProp<RoutesParamsType, T>
export type NavigationPropType<T: RoutesType> = StackNavigationProp<RoutesParamsType, T>
