// @flow

import { createAction } from 'redux-actions'
import { clearStoreOnCityChange } from '../../endpoint/actions/remover'
import type { Dispatch, GetState } from 'redux-first-router/dist/flow-types'

export const MAIN_DISCLAIMER_ROUTE = 'MAIN_DISCLAIMER'

export const goToMainDisclaimer = () => createAction(MAIN_DISCLAIMER_ROUTE)()

/**
 * MainDisclaimerRoute, matches /disclaimer
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
export const mainDisclaimerRoute = {
  path: '/disclaimer',
  thunk: (dispatch: Dispatch, getState: GetState) => {
    const prev = getState().location.prev

    if (prev.payload.city) {
      clearStoreOnCityChange(dispatch, getState)
    }
  }
}
