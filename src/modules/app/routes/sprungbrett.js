// @flow

import extrasEndpoint from '../../endpoint/endpoints/extras'
import sprungbrettEndpoint from '../../endpoint/endpoints/sprungbrettJobs'
import { createAction } from 'redux-actions'

import type { Dispatch, GetState, Route } from 'redux-first-router'
import ExtraModel from '../../endpoint/models/ExtraModel'
import CityModel from '../../endpoint/models/CityModel'
import SprungbrettModel from '../../endpoint/models/SprungbrettJobModel'
import SprungbrettExtraPage from '../../../routes/sprungbrett/containers/SprungbrettExtraPage'
import React from 'react'

export const SPRUNGBRETT_ROUTE = 'SPRUNGBRETT'
export const SPRUNGBRETT_EXTRA = 'sprungbrett'

export const goToSprungbrettExtra = (city: string, language: string) =>
  createAction(SPRUNGBRETT_ROUTE)({city, language})

export const getSprungbrettExtraPath = (city: string, language: string): string =>
  `/${city}/${language}/extras/${SPRUNGBRETT_EXTRA}`

export const renderSprungbrettPage = (props: {|sprungbrettJobs: Array<SprungbrettModel>, extras: Array<ExtraModel>,
  cities: Array<CityModel>|}) => <SprungbrettExtraPage {...props} />

export const sprungbrettRoute: Route = {
  path: `/:city/:language/extras/${SPRUNGBRETT_EXTRA}`,
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const {city, language} = state.location.payload

    const extrasPayload = await extrasEndpoint.loadData(dispatch, state.extras, {city, language})
    const extras: ?Array<ExtraModel> = extrasPayload.data

    if (extras) {
      const sprungbrettExtra: ExtraModel | void = extras.find(extra => extra.alias === SPRUNGBRETT_EXTRA)
      if (sprungbrettExtra) {
        const params = {city, language, url: sprungbrettExtra.path}
        const sprungbrettEndpoint1 = sprungbrettEndpoint

        await sprungbrettEndpoint1.loadData(dispatch, state.sprungbrettJobs, params)
      }
    }
  }
}
