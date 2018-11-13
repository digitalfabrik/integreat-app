// @flow

import type { Dispatch, GetState, Route as RouterRouteType } from 'redux-first-router'
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

const getRoutePath = ({city, language}: RouteParamsType): string =>
  `/${city}/${language}/locations`

const renderPoisPage = ({pois, cities}: RequiredPayloadType) =>
  <PoisPage pois={pois.data} cities={cities.data} />

const getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadType =>
  ({pois: payloads.poisPayload, cities: payloads.citiesPayload})

const route: RouterRouteType = {
  path: '/:city/:language/locations/:poiId?',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const {city, language} = state.location.payload

    await fetchData(poisEndpoint, dispatch, state.pois, {city, language})
  }
}

const poisRoute: Route<RequiredPayloadType, RouteParamsType> = new Route({
  name: POIS_ROUTE,
  getRoutePath,
  renderPage: renderPoisPage,
  route,
  getRequiredPayloads: getRequiredPayloads
})

export default poisRoute
