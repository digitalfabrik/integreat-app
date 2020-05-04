// @flow

import {
  Payload, CategoriesMapModel,
  ExtraModel,
  EventModel,
  LocalNewsModel,
  TuNewsModel,
  TuNewsElementModel,
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

export type StateType = {
  location: LocationState,
  categories: Payload<CategoriesMapModel>,
  extras: Payload<Array<ExtraModel>>,
  events: Payload<Array<EventModel>>,
  news: Payload<Array<LocalNewsModel>>,
  newsElement: Payload<Array<LocalNewsModel>>,
  tunewsList: Payload<Array<TuNewsModel>>,
  tunewsElement: Payload<Array<TuNewsElementModel>>,
  cities: Payload<Array<CityModel>>,
  languages: Payload<Array<LanguageModel>>,
  disclaimer: Payload<PageModel>,
  sprungbrettJobs: Payload<Array<SprungbrettJobModel>>,
  wohnen: Payload<Array<WohnenOfferModel>>,
  viewport: ViewportType,
  uiDirection: UiDirectionType,
  darkMode: boolean,
  pois: Payload<Array<PoiModel>>
}
