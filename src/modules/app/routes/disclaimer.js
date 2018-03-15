// @flow

import { disclaimerFetcher, locationLayoutFetcher } from '../../endpoint/fetchers'
import { createAction } from 'redux-actions'

import type { Dispatch, GetState } from 'redux-first-router/dist/flow-types'

export const DISCLAIMER_ROUTE = 'DISCLAIMER'

export const goToDisclaimer = (city: string, language: string) => createAction(DISCLAIMER_ROUTE)({city, language})

export const disclaimerRoute = {
  path: '/:city/:language/disclaimer',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const {city, language} = state.location.payload
    const prev = state.location.prev

    await locationLayoutFetcher(dispatch, getState)

    if (!state.disclaimer || prev.payload.city !== city || prev.payload.language !== language) {
      await disclaimerFetcher(dispatch, {city, language})
    }
  }
}
