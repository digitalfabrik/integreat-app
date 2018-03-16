// @flow

import { createAction } from 'redux-actions'
import type { Dispatch, GetState } from 'redux-first-router/dist/flow-types'
import { citiesFetcher, languagesFetcher } from '../../endpoint/fetchers'

export const NOT_FOUND_ROUTE = 'NOT_FOUND'

export const goToNotFound = (city: string, language: ?string) =>
  createAction(NOT_FOUND_ROUTE)(city, language)

export const notFoundRoute = {
  route: '/not-found',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const city = state.payload.city

    let cities = state.cities
    if (!cities) {
      cities = await citiesFetcher(dispatch)
    }

    if (!state.languages && cities.includes(_city => _city.code === city)) {
      await languagesFetcher(dispatch, {city})
    }
  }
}
