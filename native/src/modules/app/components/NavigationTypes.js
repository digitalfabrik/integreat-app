// @flow

import type { StackNavigationProp } from '@react-navigation/stack'
import type { RouteProp } from '@react-navigation/native'
import type { FeedbackInformationType } from '../../../routes/feedback/containers/FeedbackModalContainer'
import { LanguageModel, OfferModel } from 'api-client'

export type IntroRouteType = 'intro'
export const INTRO_ROUTE: IntroRouteType = 'intro'

export type LandingRouteType = 'landing'
export const LANDING_ROUTE: LandingRouteType = 'landing'

export type DashboardRouteType = 'dashboard'
export const DASHBOARD_ROUTE: DashboardRouteType = 'dashboard'

export type CategoriesRouteType = 'categories'
export const CATEGORIES_ROUTE: CategoriesRouteType = 'categories'

export type PoisRouteType = 'pois'
export const POIS_ROUTE: PoisRouteType = 'pois'

export type EventsRouteType = 'events'
export const EVENTS_ROUTE: EventsRouteType = 'events'

export type NewsRouteType = 'news'
export const NEWS_ROUTE: NewsRouteType = 'news'

export type DisclaimerRouteType = 'disclaimer'
export const DISCLAIMER_ROUTE: DisclaimerRouteType = 'disclaimer'

export type OffersRouteType = 'offers'
export const OFFERS_ROUTE: OffersRouteType = 'offers'

export type ExternalOfferRouteType = 'externalOffer'
export const EXTERNAL_OFFER_ROUTE: ExternalOfferRouteType = 'externalOffer'

export type SprungbrettOfferRouteType = 'sprungbrett'
export const SPRUNGBRETT_OFFER_ROUTE: SprungbrettOfferRouteType = 'sprungbrett'

export type WohnenOfferRouteType = 'wohnen'
export const WOHNEN_OFFER_ROUTE: WohnenOfferRouteType = 'wohnen'

export type SettingsRouteType = 'settings'
export const SETTINGS_ROUTE: SettingsRouteType = 'settings'

export type SearchModalRouteType = 'search'
export const SEARCH_MODAL_ROUTE: SearchModalRouteType = 'search'

export type ChangeLanguageModalRouteType = 'changeLanguage'
export const CHANGE_LANGUAGE_MODAL_ROUTE: ChangeLanguageModalRouteType = 'changeLanguage'

export type PdfViewModalRouteType = 'pdf'
export const PDF_VIEW_MODAL_ROUTE: PdfViewModalRouteType = 'pdf'

export type ImageViewModalRouteType = 'image'
export const IMAGE_VIEW_MODAL_ROUTE: ImageViewModalRouteType = 'image'

export type FeedbackModalRouteType = 'feedback'
export const FEEDBACK_MODAL_ROUTE: FeedbackModalRouteType = 'feedback'

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
  | SearchModalRouteType
  | ChangeLanguageModalRouteType
  | PdfViewModalRouteType
  | ImageViewModalRouteType
  | FeedbackModalRouteType

type ShareUrlType = {| shareUrl: string |}

export type RoutesParamsType = {|
  intro: void,
  landing: void,
  dashboard: ShareUrlType,
  categories: ShareUrlType,
  pois: ShareUrlType,
  events: ShareUrlType,
  news: ShareUrlType,
  disclaimer: ShareUrlType,
  offers: {| ...ShareUrlType, cityCode: string |},
  externalOffer: {| ...ShareUrlType, url: string, postData: ?Map<string, string> |},
  sprungbrett: {| ...ShareUrlType, city: string, offers: Array<OfferModel> |},
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
