// @flow

import extrasEndpoint from '../../endpoint/endpoints/extras'
import { createAction } from 'redux-actions'

import type { Dispatch, GetState, Route as RouterRouteType, Action } from 'redux-first-router'
import CityModel from '../../endpoint/models/CityModel'
import ExtraModel from '../../endpoint/models/ExtraModel'
import ExtrasPage from '../../../routes/extras/containers/ExtrasPage'
import React from 'react'
import Payload from '../../endpoint/Payload'
import type { AllPayloadsType } from './types'
import Route from './Route'
import fetchData from '../fetchData'

type RequiredPayloadType = {|extras: Payload<Array<ExtraModel>>, cities: Payload<Array<CityModel>>|}
type RouteParamsType = {|city: string, language: string|}

export const EXTRAS_ROUTE = 'EXTRAS'

export const goToExtras = (city: string, language: string): Action =>
  createAction<string, { city: string, language: string }>(EXTRAS_ROUTE)({city, language})

const getRoutePath = ({city, language}: RouteParamsType): string => `/${city}/${language}/extras`

const renderExtrasPage = ({extras, cities}: RequiredPayloadType) => <ExtrasPage extras={extras} cities={cities} />

const getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadType =>
  ({extras: payloads.extrasPayload, cities: payloads.citiesPayload})

/**
 * ExtrasRoute, matches /augsburg/de/extras and /augsburg/de/extras
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
const extrasRoute: RouterRouteType = {
  path: '/:city/:language/extras',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const {city, language} = state.location.payload

    await fetchData(extrasEndpoint, dispatch, state.extras, {city, language})
  }
}

export default new Route<RequiredPayloadType, RouteParamsType>({
  name: EXTRAS_ROUTE,
  getRoutePath,
  renderPage: renderExtrasPage,
  route: extrasRoute,
  getRequiredPayloads
})
