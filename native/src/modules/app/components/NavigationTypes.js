// @flow

import type { StackNavigationProp } from '@react-navigation/stack'
import type { RouteProp } from '@react-navigation/native'
import type { FeedbackInformationType } from '../../../routes/feedback/containers/FeedbackModalContainer'

export type IntroRouteType = 'Intro'
export const INTRO_ROUTE: IntroRouteType = 'Intro'

export type LandingRouteType = 'Landing'
export const LANDING_ROUTE: LandingRouteType = 'Landing'

export type DashboardRouteType = 'Dashboard'
export const DASHBOARD_ROUTE: DashboardRouteType = 'Dashboard'

export type CategoriesRouteType = 'Categories'
export const CATEGORIES_ROUTE: CategoriesRouteType = 'Categories'

export type PoisRouteType = 'Pois'
export const POIS_ROUTE: PoisRouteType = 'Pois'

export type EventsRouteType = 'Events'
export const EVENTS_ROUTE: EventsRouteType = 'Events'

export type NewsRouteType = 'News'
export const NEWS_ROUTE: NewsRouteType = 'News'

export type DisclaimerRouteType = 'Disclaimer'
export const DISCLAIMER_ROUTE: DisclaimerRouteType = 'Disclaimer'

export type OffersRouteType = 'Offers'
export const OFFERS_ROUTE: OffersRouteType = 'Offers'

export type ExternalOfferRouteType = 'ExternalOffer'
export const EXTERNAL_OFFER_ROUTE: ExternalOfferRouteType = 'ExternalOffer'

export type SprungbrettOfferRouteType = 'SprungbrettOffer'
export const SPRUNGBRETT_OFFER_ROUTE: SprungbrettOfferRouteType = 'SprungbrettOffer'

export type WohnenOfferRouteType = 'WohnenOffer'
export const WOHNEN_ROUTE: WohnenOfferRouteType = 'WohnenOffer'

export type SettingsRouteType = 'Settings'
export const SETTINGS_ROUTE: SettingsRouteType = 'Settings'

export type SearchModalRouteType = 'SearchModal'
export const SEARCH_MODAL_ROUTE: SearchModalRouteType = 'SearchModal'

export type ChangeLanguageModalRouteType = 'ChangeLanguageModal'
export const CHANGE_LANGUAGE_MODAL_ROUTE: ChangeLanguageModalRouteType = 'ChangeLanguageModal'

export type PdfViewModalRouteType = 'PDFViewModal'
export const PDF_VIEW_MODAL_ROUTE: PdfViewModalRouteType = 'PDFViewModal'

export type ImageViewModalRouteType = 'ImageViewModal'
export const IMAGE_VIEW_MODAL_ROUTE: ImageViewModalRouteType = 'ImageViewModal'

export type FeedbackModalRouteType = 'FeedbackModal'
export const FEEDBACK_MODAL_ROUTE: FeedbackModalRouteType = 'FeedbackModal'

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

export type RoutesParamsType = {|
  Intro: {||},
  Landing: {| navigateToCityContent: (cityCode: string, languageCode: string) => void |},
  Dashboard: {||},
  Categories: {||},
  Pois: {||},
  Events: {||},
  News: {||},
  Disclaimer: {||},
  Offers: {| cityCode: string, sharePath: string |},
  ExternalOffer: {| url: string, postData?: Map<string, string> |},
  SprungbrettOffer: {||},
  WohnenOffer: {||},
  Settings: {||},
  SearchModal: {||},
  ChangeLanguageModal: {||},
  PDFViewModal: {||},
  ImageViewModal: {| url: string |},
  FeedbackModal: {| ...FeedbackInformationType |}
|}

export type RoutePropType<T: RoutesType> = RouteProp<RoutesParamsType, T>
export type NavigationPropType<T: RoutesType> = StackNavigationProp<RoutesParamsType, T>
