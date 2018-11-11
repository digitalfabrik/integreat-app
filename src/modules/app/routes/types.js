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
import type { Action } from 'redux-first-router'

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
