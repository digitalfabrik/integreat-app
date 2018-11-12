// @flow

import { createAction } from 'redux-actions'
import type { Dispatch, GetState, Route } from 'redux-first-router'
import poisEndpoint from '../../endpoint/endpoints/pois'
import fetchData from '../fetchData'

export const POIS_ROUTE = 'POI'

export const goToPois = (city: string, language: string, poiId: ?string) =>
  createAction<string, { city: string, language: string, poiId: ?string }>(POIS_ROUTE)({city, language, poiId})

export const getPoisPath = (city: string, language: string): string =>
  `/${city}/${language}/locations`

export const poisRoute: Route = {
  path: '/:city/:language/locations/:poiId?',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const {city, language} = state.location.payload

    await fetchData(poisEndpoint, dispatch, state.pois, {city, language})
  }
}
