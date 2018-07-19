// @flow

import type { LocationState } from 'redux-first-router'
import CityModel from './modules/endpoint/models/CityModel'
import DisclaimerModel from './modules/endpoint/models/DisclaimerModel'
import ExtraModel from './modules/endpoint/models/ExtraModel'
import SprungbrettJobModel from './modules/endpoint/models/SprungbrettJobModel'
import EventModel from './modules/endpoint/models/EventModel'
import CategoriesMapModel from './modules/endpoint/models/CategoriesMapModel'
import LanguageModel from './modules/endpoint/models/LanguageModel'
import WohnenOfferModel from './modules/endpoint/models/WohnenOfferModel'

export type UiDirectionType = 'ltr' | 'rtl'

// export type PayloadDataType = Array<CityModel | LanguageModel | EventModel | ExtraModel | SprungbrettJobModel> |
//   CategoriesMapModel | DisclaimerModel

export type PayloadType<T> = {
  data: ?T,
  isFetching: boolean,
  error: ?Error,
  requestUrl: ?string,
  fetchDate: number
}

export type StateType = {
  +location: LocationState,
  +categories: PayloadType<CategoriesMapModel>,
  +extras: PayloadType<Array<ExtraModel>>,
  +events: PayloadType<Array<EventModel>>,
  +cities: PayloadType<Array<CityModel>>,
  +languages: PayloadType<Array<LanguageModel>>,
  +disclaimer: PayloadType<DisclaimerModel>,
  +sprungbrettJobs: PayloadType<Array<SprungbrettJobModel>>,
  +wohnen: PayloadType<Array<WohnenOfferModel>>,
  +viewport: {...any, +is: {+small: boolean, +large: boolean}},
  +uiDirection: UiDirectionType
}

// export type EndpointParamsType = {city?: string, language?: string, url?: string}

export type MapParamsToUrlType<P> = (params: P) => string
export type MapResponseType<P, T> = (json: any, params: P) => T
