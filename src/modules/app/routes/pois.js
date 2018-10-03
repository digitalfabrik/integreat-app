// @flow

import { createAction } from 'redux-actions'
import type { Dispatch, GetState } from 'redux-first-router'
import poisEndpoint from '../../endpoint/endpoints/pois'

export const POIS_ROUTE = 'POI'

export const goToPois = (city: string, language: string, poiId: ?string) =>
  createAction(POIS_ROUTE)({city, language, poiId})

export const poisRoute = {
  path: '/:city/:language/locations/:poiId?',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const {city, language} = state.location.payload

    await poisEndpoint.loadData(dispatch, state.pois, {city, language})
  }
}
