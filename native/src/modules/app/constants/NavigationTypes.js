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
type CityContentParamsType = {| ...ShareUrlType, cityCode: string, languageCode: string |}

export type RoutesParamsType = {|
  intro: void,
  landing: void,
  dashboard: CityContentParamsType,
  categories: CityContentParamsType,
  pois: ShareUrlType,
  events: ShareUrlType,
  news: ShareUrlType,
  disclaimer: CityContentParamsType,
  offers: CityContentParamsType,
  externalOffer: {| ...ShareUrlType, url: string, postData: ?Map<string, string> |},
  sprungbrett: {| ...CityContentParamsType, title: string, alias: string |},
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
