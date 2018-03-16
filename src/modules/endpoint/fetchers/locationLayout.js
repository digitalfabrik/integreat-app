// @flow

import { citiesFetcher, eventsFetcher, languagesFetcher } from '../../endpoint/fetchers'
import type { Dispatch, GetState } from 'redux-first-router/dist/flow-types'

/**
 * Fetches all needed data for the LocationLayout/ LocationHeader
 * @param dispatch
 * @param getState
 * @return {Promise<void>}
 */
const fetcher = async (dispatch: Dispatch, getState: GetState) => {
  const state = getState()
  const {city, language} = state.location.payload
  const params = {city: city, language: language}
  const prev = state.location.prev

  if (!state.cities) {
    await citiesFetcher(dispatch, params)
  }

  if (!state.languages || prev.payload.city !== city) {
    await languagesFetcher(dispatch, params)
  }

  if (!state.events || prev.payload.city !== city || prev.payload.language !== language) {
    await eventsFetcher(dispatch, params)
  }
}

export default fetcher
