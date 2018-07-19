// @flow

import Payload from '../endpoint/Payload'
import CategoriesMapModel from '../endpoint/models/CategoriesMapModel'
import ExtraModel from '../endpoint/models/ExtraModel'
import EventModel from '../endpoint/models/EventModel'
import CityModel from '../endpoint/models/CityModel'
import LanguageModel from '../endpoint/models/LanguageModel'
import DisclaimerModel from '../endpoint/models/DisclaimerModel'
import SprungbrettJobModel from '../endpoint/models/SprungbrettJobModel'
import WohnenOfferModel from '../endpoint/models/WohnenOfferModel'
import type { LocationState } from 'redux-first-router'

export type UiDirectionType = 'ltr' | 'rtl'
export type ViewportType = { +is: { +small: boolean, +large: boolean } }

export type StateType = {
  location: LocationState,
  categories: Payload<CategoriesMapModel>,
  extras: Payload<Array<ExtraModel>>,
  events: Payload<Array<EventModel>>,
  cities: Payload<Array<CityModel>>,
  languages: Payload<Array<LanguageModel>>,
  disclaimer: Payload<DisclaimerModel>,
  sprungbrettJobs: Payload<Array<SprungbrettJobModel>>,
  wohnen: Payload<Array<WohnenOfferModel>>,
  viewport: ViewportType,
  uiDirection: UiDirectionType
}
