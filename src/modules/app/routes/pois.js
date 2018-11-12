// @flow

import { createAction } from 'redux-actions'
import type { Dispatch, GetState, Route as RouterRouteType, Action } from 'redux-first-router'
import poisEndpoint from '../../endpoint/endpoints/pois'
import CityModel from '../../endpoint/models/CityModel'
import PoiModel from '../../endpoint/models/PoiModel'
import PoisPage from '../../../routes/pois/containers/PoisPage'
import React from 'react'
import Route from './Route'
import type { AllPayloadsType } from './types'
import Payload from '../../endpoint/Payload'
import fetchData from '../fetchData'

type RequiredPayloadType = {|pois: Payload<Array<PoiModel>>, cities: Payload<Array<CityModel>>|}
type RouteParamsType = {|city: string, language: string|}

export const POIS_ROUTE = 'POI'
export const goToPois = (city: string, language: string, poiId: ?string) =>
  createAction<string, { city: string, language: string, poiId: ?string }>(POIS_ROUTE)({city, language, poiId})

const getRoutePath = ({city, language}: RouteParamsType): string =>
  `/${city}/${language}/locations`

const renderPoisPage = ({pois, cities}: RequiredPayloadType): Action => <PoisPage pois={pois} cities={cities} />

const getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadType =>
  ({pois: payloads.poisPayload, cities: payloads.citiesPayload})

const poisRoute: RouterRouteType = {
  path: '/:city/:language/locations/:poiId?',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const {city, language} = state.location.payload

    await fetchData(poisEndpoint, dispatch, state.pois, {city, language})
  }
}

export default new Route<RequiredPayloadType, RouteParamsType>({
  name: POIS_ROUTE,
  getRoutePath,
  renderPage: renderPoisPage,
  route: poisRoute,
  getRequiredPayloads: getRequiredPayloads
})
