// @flow

import type { Location } from 'redux-first-router/dist/flow-types'
import CityModel from './modules/endpoint/models/CityModel'
import DisclaimerModel from './modules/endpoint/models/DisclaimerModel'
import ExtraModel from './modules/endpoint/models/ExtraModel'
import SprungbrettJobModel from './modules/endpoint/models/SprungbrettJobModel'
import EventModel from './modules/endpoint/models/EventModel'
import CategoriesMapModel from './modules/endpoint/models/CategoriesMapModel'
import LanguageModel from './modules/endpoint/models/LanguageModel'

export type I18nTranslate = string => string

export type UiDirection = 'ltr' | 'rtl'

export type PayloadData = Array<CityModel | LanguageModel | EventModel | ExtraModel | SprungbrettJobModel> |
  CategoriesMapModel | DisclaimerModel

export type Payload<data: PayloadData> = {
  data: ?data,
  isFetching: boolean,
  error: ?Error,
  requestUrl: ?string,
  fetchDate: number
}

export type State = {
  +location: Location,
  +categories: Payload<CategoriesMapModel>,
  +extras: Payload<Array<ExtraModel>>,
  +events: Payload<Array<EventModel>>,
  +cities: Payload<Array<CityModel>>,
  +languages: Payload<Array<LanguageModel>>,
  +disclaimer: Payload<DisclaimerModel>,
  +sprungbrettJobs: Payload<Array<SprungbrettJobModel>>,
  +extras: Payload<Array<ExtraModel>>,
  +viewport: {...any, +is: {+small: boolean, +large: boolean}},
  +uiDirection: UiDirection
}
