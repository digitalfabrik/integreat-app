// @flow

import { disclaimerFetcher, locationLayoutFetcher } from '../../endpoint/fetchers'
import { createAction } from 'redux-actions'

import type { Dispatch, GetState } from 'redux-first-router/dist/flow-types'
import { clearStoreOnCityChange, clearStoreOnLanguageChange } from '../../endpoint/actions/remover'

export const DISCLAIMER_ROUTE = 'DISCLAIMER'

export const goToDisclaimer = (city: string, language: string) => createAction(DISCLAIMER_ROUTE)({city, language})

export const disclaimerRoute = {
  path: '/:city/:language/disclaimer',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const {city, language} = state.location.payload
    const prev = state.location.prev

    if (prev.payload.language && prev.payload.language !== language) {
      clearStoreOnLanguageChange(dispatch, getState)
    }

    if (prev.payload.city && prev.payload.city !== city) {
      clearStoreOnCityChange(dispatch, getState)
    }

    await locationLayoutFetcher(dispatch, getState)

    if (!state.disclaimer) {
      await disclaimerFetcher(dispatch, {city, language})
    }
  }
}
