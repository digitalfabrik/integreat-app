// @flow

import {
  CategoriesMapModel,
  CityModel,
  EventModel,
  OfferModel,
  LanguageModel,
  LocalNewsModel,
  PageModel,
  Payload,
  PoiModel,
  SprungbrettJobModel,
  TunewsModel,
  WohnenOfferModel
} from 'api-client'
import type { LocationState } from 'redux-first-router'

export type ViewportType = { +is: { +small: boolean, +large: boolean } }

export type TunewsStateType = {
  allData: Array<TunewsModel>,
  language: string | null,
  hasMore: boolean,
  payload: Payload<Array<TunewsModel>>
}

export type StateType = {
  location: LocationState,
  categories: Payload<CategoriesMapModel>,
  offers: Payload<Array<OfferModel>>,
  events: Payload<Array<EventModel>>,
  localNews: Payload<Array<LocalNewsModel>>,
  localNewsElement: Payload<LocalNewsModel>,
  tunews: TunewsStateType,
  tunewsLanguages: Payload<Array<LanguageModel>>,
  tunewsElement: Payload<TunewsModel>,
  cities: Payload<Array<CityModel>>,
  languages: Payload<Array<LanguageModel>>,
  disclaimer: Payload<PageModel>,
  sprungbrettJobs: Payload<Array<SprungbrettJobModel>>,
  wohnen: Payload<Array<WohnenOfferModel>>,
  viewport: ViewportType,
  darkMode: boolean,
  pois: Payload<Array<PoiModel>>
}
