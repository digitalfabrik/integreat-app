// @flow

import {
  CategoriesMapModel,
  CityModel,
  EventModel,
  ExtraModel,
  LanguageModel,
  PageModel, SprungbrettJobModel, WohnenOfferModel
} from '@integreat-app/integreat-api-client'

export type PayloadDataType = Array<CityModel> | Array<LanguageModel> | Array<ExtraModel> | Array<EventModel>
  | PageModel | CategoriesMapModel | Array<SprungbrettJobModel> | Array<WohnenOfferModel>
