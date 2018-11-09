// @flow

import { createAction } from 'redux-actions'
import type { Dispatch, GetState, Route } from 'redux-first-router'
import poisEndpoint from '../../endpoint/endpoints/pois'
import CityModel from '../../endpoint/models/CityModel'
import PoiModel from '../../endpoint/models/PoiModel'
import PoisPage from '../../../routes/pois/containers/PoisPage'
import React from 'react'

export const POIS_ROUTE = 'POI'

export const goToPois = (city: string, language: string, poiId: ?string) =>
  createAction(POIS_ROUTE)({city, language, poiId})

export const getPoisPath = (city: string, language: string): string =>
  `/${city}/${language}/locations`

export const renderPoisPage = (props: {|pois: Array<PoiModel>, cities: Array<CityModel>|}) =>
  <PoisPage {...props} />

export const poisRoute: Route = {
  path: '/:city/:language/locations/:poiId?',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const {city, language} = state.location.payload

    await poisEndpoint.loadData(dispatch, state.pois, {city, language})
  }
}
