// @flow

import type { StackNavigationProp } from '@react-navigation/stack'
import type { RouteProp } from '@react-navigation/native'
import { LanguageModel } from 'api-client'
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
import type { JpalEvaluationRouteType, RedirectRouteType } from 'api-client'

export type RoutesType =
  | RedirectRouteType
  | JpalEvaluationRouteType
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

type ShareUrlType = {| shareUrl: string |}
type CityContentParamsType = {| cityCode: string, languageCode: string |}

export type RoutesParamsType = {|
  redirect: {| url: string |},
  intro: {| deepLink?: string |},
  landing: void,
  dashboard: CityContentParamsType,
  categories: CityContentParamsType,
  pois: void,
  events: void,
  news: void,
  disclaimer: CityContentParamsType,
  offers: CityContentParamsType,
  'jpal-evaluation': {| trackingCode: string | null |},
  externalOffer: {| ...ShareUrlType, url: string, postData: ?Map<string, string> |},
  sprungbrett: {| ...CityContentParamsType, title: string, alias: string, apiUrl: string |},
  wohnen: {| offerHash: ?string, city: string, title: string, alias: string, postData: ?Map<string, string> |},
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
