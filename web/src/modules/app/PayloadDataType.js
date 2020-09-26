// @flow

import {
  CategoriesMapModel,
  CityModel,
  EventModel,
  OfferModel,
  LanguageModel,
  LocalNewsModel,
  PageModel,
  PoiModel,
  SprungbrettJobModel,
  TunewsModel,
  WohnenOfferModel
} from '@integreat-app/integreat-api-client'

export type PayloadDataType = Array<CityModel> | Array<LanguageModel> | Array<OfferModel> | Array<EventModel>
  | PageModel | CategoriesMapModel | Array<SprungbrettJobModel> | Array<WohnenOfferModel> | Array<LocalNewsModel>
  | LocalNewsModel | Array<TunewsModel> | TunewsModel | Array<PoiModel>
