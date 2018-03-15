// @flow

import { citiesFetcher } from '../../endpoint/fetchers'
import { createAction } from 'redux-actions'

import type { Dispatch, GetState } from 'redux-first-router/dist/flow-types'
import { clearStoreOnCityChange } from '../../endpoint/remover'

export const LANDING_ROUTE = 'LANDING'

export const goToLanding = (language: string) => createAction(LANDING_ROUTE)({language})

export const landingRoute = {
  path: '/landing/:language',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const prev = getState().location.prev

    if (prev.payload.city) {
      clearStoreOnCityChange(dispatch, getState)
    }

    if (!getState().cities) {
      await citiesFetcher(dispatch, {})
    }
  }
}
