// @flow

import {
  CategoriesMapModel,
  CityModel,
  EventModel,
  ExtraModel,
  LanguageModel,
  LocalNewsModel,
  PageModel,
  Payload,
  PoiModel,
  SprungbrettJobModel,
  TunewsModel,
  WohnenOfferModel
} from '@integreat-app/integreat-api-client'
import type { LocationState } from 'redux-first-router'
import type { UiDirectionType } from '../i18n/types/UiDirectionType'

export type ViewportType = { +is: { +small: boolean, +large: boolean } }

export type TunewsStateType = { allData: TunewsModel[], hasMore: boolean, payload: Payload<TunewsModel[]> }

export type StateType = {
  location: LocationState,
  categories: Payload<CategoriesMapModel>,
  extras: Payload<Array<ExtraModel>>,
  events: Payload<Array<EventModel>>,
  localNews: Payload<Array<LocalNewsModel>>,
  localNewsElement: Payload<LocalNewsModel>,
  tunews: TunewsStateType,
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
}
