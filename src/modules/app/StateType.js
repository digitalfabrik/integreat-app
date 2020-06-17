// @flow

import {
  Payload, CategoriesMapModel,
  OfferModel,
  EventModel,
  LocalNewsModel,
  TunewsModel,
  CityModel,
  LanguageModel,
  PageModel,
  SprungbrettJobModel,
  WohnenOfferModel,
  PoiModel
} from '@integreat-app/integreat-api-client'
import type { LocationState } from 'redux-first-router'
import type { UiDirectionType } from '../i18n/types/UiDirectionType'

export type ViewportType = { +is: { +small: boolean, +large: boolean } }

export type StateType = {|
  location: LocationState,
  categories: Payload<CategoriesMapModel>,
  offers: Payload<Array<OfferModel>>,
  events: Payload<Array<EventModel>>,
  localNews: Payload<Array<LocalNewsModel>>,
  localNewsElement: Payload<LocalNewsModel>,
  tunews: Payload<Array<TunewsModel>>,
  tunewsElement: Payload<TunewsModel>,
  cities: Payload<Array<CityModel>>,
  languages: Payload<Array<LanguageModel>>,
  disclaimer: Payload<PageModel>,
  sprungbrettJobs: Payload<Array<SprungbrettJobModel>>,
  wohnen: Payload<Array<WohnenOfferModel>>,
  viewport: ViewportType,
  uiDirection: UiDirectionType,
  darkMode: boolean,
  pois: Payload<Array<PoiModel>>
|}
