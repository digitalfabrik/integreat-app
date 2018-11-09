// @flow

import extrasEndpoint from '../../endpoint/endpoints/extras'
import { createAction } from 'redux-actions'

import type { Dispatch, GetState, Route } from 'redux-first-router'
import CityModel from '../../endpoint/models/CityModel'
import ExtraModel from '../../endpoint/models/ExtraModel'
import ExtrasPage from '../../../routes/extras/containers/ExtrasPage'
import React from 'react'

export const EXTRAS_ROUTE = 'EXTRAS'

export const goToExtras = (city: string, language: string) =>
  createAction(EXTRAS_ROUTE)({city, language})

export const getExtraPath = (city: string, language: string, internalExtra: ?string): string =>
  `/${city}/${language}/extras${internalExtra ? `/${internalExtra}` : ''}`

export const renderExtrasPage = (props: {|extras: Array<ExtraModel>, cities: Array<CityModel>|}) =>
  <ExtrasPage {...props} />

/**
 * ExtrasRoute, matches /augsburg/de/extras and /augsburg/de/extras/sprungbrett
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
export const extrasRoute: Route = {
  path: '/:city/:language/extras/:extraId?',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const {city, language} = state.location.payload

    await extrasEndpoint.loadData(dispatch, state.extras, {city, language})
  }
}
