// @flow

import { createAction } from 'redux-actions'
import type { Dispatch, GetState, Route as RouterRouteType, Location } from 'redux-first-router'
import poisEndpoint from '../../endpoint/endpoints/pois'
import CityModel from '../../endpoint/models/CityModel'
import PoiModel from '../../endpoint/models/PoiModel'
import PoisPage from '../../../routes/pois/containers/PoisPage'
import React from 'react'
import Route from './Route'
import type { AllPayloadsType } from './types'
import Payload from '../../endpoint/Payload'

const POIS_ROUTE = 'POI'

const goToPois = (city: string, language: string, poiId: ?string) =>
  createAction(POIS_ROUTE)({city, language, poiId})

const getPoisPath = (city: string, language: string): string =>
  `/${city}/${language}/locations`

const renderPoisPage = ({pois, cities}: {|pois: Payload<Array<PoiModel>>, cities: Payload<Array<CityModel>>|}) =>
  <PoisPage pois={pois} cities={cities} />

const getLanguageChangePath = ({pois, location, language, city}: {pois: Array<PoiModel>,
  language: string, location: Location, city: string}) => {
  const {poiId} = location.payload
  if (pois && poiId) {
    const poi = pois.find(_poi => _poi.path === location.pathname)
    return (poi && poi.availableLanguages.get(language)) || null
  }
  return getPoisPath(city, language)
}

const getRequiredPayloads = (payloads: AllPayloadsType) =>
  ({pois: payloads.poisPayload, cities: payloads.citiesPayload})

const poisRoute: RouterRouteType = {
  path: '/:city/:language/locations/:poiId?',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const {city, language} = state.location.payload

    await poisEndpoint.loadData(dispatch, state.pois, {city, language})
  }
}

export default new Route({
  name: POIS_ROUTE,
  goToRoute: goToPois,
  getRoutePath: getPoisPath,
  getLanguageChangePath: getLanguageChangePath,
  renderPage: renderPoisPage,
  route: poisRoute,
  getRequiredPayloads: getRequiredPayloads
})
