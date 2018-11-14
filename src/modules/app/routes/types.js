// @flow

import CategoriesMapModel from '../../endpoint/models/CategoriesMapModel'
import SprungbrettExtraPage from '../../../routes/sprungbrett/containers/SprungbrettExtraPage'
import ExtraModel from '../../endpoint/models/ExtraModel'
import PageModel from '../../endpoint/models/PageModel'
import Payload from '../../endpoint/Payload'
import WohnenOfferModel from '../../endpoint/models/WohnenOfferModel'
import PoiModel from '../../endpoint/models/PoiModel'
import EventModel from '../../endpoint/models/EventModel'
import CityModel from '../../endpoint/models/CityModel'
import type { Location } from 'redux-first-router'
import type { TFunction } from 'react-i18next'

export type AllPayloadsType = {|
  citiesPayload: Payload<Array<CityModel>>,
  categoriesPayload: Payload<CategoriesMapModel>,
  poisPayload: Payload<Array<PoiModel>>,
  eventsPayload: Payload<Array<EventModel>>,
  extrasPayload: Payload<Array<ExtraModel>>,
  sprungbrettJobsPayload: Payload<Array<SprungbrettExtraPage>>,
  wohnenPayload: Payload<Array<WohnenOfferModel>>,
  disclaimerPayload: Payload<PageModel>
|}

export type GetLanguageChangePathParamsType = {|location: Location, events?: Array<EventModel>,
  categories?: CategoriesMapModel, pois?: Array<PoiModel>, language: string|}

export type GetLanguageChangePathType = GetLanguageChangePathParamsType => string | null

export type GetPageTitleParamsType = {|t: TFunction, cityName: string, pathname: string, events?: Array<EventModel>,
  categories?: CategoriesMapModel, pois?: Array<PoiModel>|}
