// @flow

import extrasEndpoint from '../../endpoint/endpoints/extras'
import sprungbrettEndpoint from '../../endpoint/endpoints/sprungbrettJobs'
import { createAction } from 'redux-actions'

import type { Dispatch, GetState, Action } from 'redux-first-router'
import ExtraModel from '../../endpoint/models/ExtraModel'
import CityModel from '../../endpoint/models/CityModel'
import SprungbrettModel from '../../endpoint/models/SprungbrettJobModel'
import SprungbrettExtraPage from '../../../routes/sprungbrett/containers/SprungbrettExtraPage'
import React from 'react'
import Payload from '../../endpoint/Payload'
import type { AllPayloadsType } from './types'
import Route from './Route'
import fetchData from '../fetchData'

type RequiredPayloadType = {|extras: Payload<Array<ExtraModel>>, sprungbrettJobs: Payload<Array<SprungbrettModel>>,
  cities: Payload<Array<CityModel>>|}

const SPRUNGBRETT_ROUTE = 'SPRUNGBRETT'
export const SPRUNGBRETT_EXTRA = 'sprungbrett'

const goToSprungbrettExtra = (city: string, language: string): Action =>
  createAction<string, { city: string, language: string }>(SPRUNGBRETT_ROUTE)({ city, language })

const getSprungbrettExtraPath = (city: string, language: string): string =>
  `/${city}/${language}/extras/${SPRUNGBRETT_EXTRA}`

const renderSprungbrettPage = ({ sprungbrettJobs, extras, cities }: RequiredPayloadType) =>
  <SprungbrettExtraPage sprungbrettJobs={sprungbrettJobs.data} extras={extras.data} cities={cities.data} />

const getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadType =>
  ({sprungbrettJobs: payloads.sprungbrettJobsPayload, extras: payloads.extrasPayload, cities: payloads.citiesPayload})

const sprungbrettRoute = {
  path: `/:city/:language/extras/${SPRUNGBRETT_EXTRA}`,
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const { city, language } = state.location.payload

    const extrasPayload = await fetchData(extrasEndpoint, dispatch, state.extras, { city, language })
    const extras: ?Array<ExtraModel> = extrasPayload.data

    if (extras) {
      const sprungbrettExtra: ExtraModel | void = extras.find(extra => extra.alias === SPRUNGBRETT_EXTRA)
      if (sprungbrettExtra) {
        const params = { city, language, url: sprungbrettExtra.path }
        const sprungbrettEndpoint1 = sprungbrettEndpoint

        await fetchData(sprungbrettEndpoint1, dispatch, state.sprungbrettJobs, params)
      }
    }
  }
}

export default new Route<RequiredPayloadType, city: string, language: string>({
  name: SPRUNGBRETT_ROUTE,
  goToRoute: goToSprungbrettExtra,
  renderPage: renderSprungbrettPage,
  route: sprungbrettRoute,
  getRequiredPayloads
})
