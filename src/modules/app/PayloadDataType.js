// @flow

import {
  CategoriesMapModel,
  CityModel,
  EventModel,
  OfferModel,
  LanguageModel,
  PageModel, SprungbrettJobModel, WohnenOfferModel,
  LocalNewsModel, TunewsModel
} from '@integreat-app/integreat-api-client'

export type PayloadDataType = Array<CityModel> | Array<LanguageModel> | Array<OfferModel> | Array<EventModel>
  | PageModel | CategoriesMapModel | Array<SprungbrettJobModel> | Array<WohnenOfferModel> | Array<LocalNewsModel>
  | Array<TunewsModel>
