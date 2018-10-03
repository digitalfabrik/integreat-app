// @flow

import { createAction } from 'redux-actions'
import type { Dispatch, GetState } from 'redux-first-router'
import poiEndpoint from '../../endpoint/endpoints/pois'

export const POI_ROUTE = 'POI'

export const goToPois = (city: string, language: string, poiId: ?string) =>
  createAction(POI_ROUTE)({city, language, poiId})

export const getPoisPath = (city: string, language: string, poiId: ?string): string =>
  `/${city}/${language}/locations${poiId ? `/${poiId}` : ''}`

export const poiRoute = {
  path: '/:city/:language/locations/:poiId?',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const {city, language} = state.location.payload

    await poiEndpoint.loadData(dispatch, state.pois, {city, language})
  }
}
