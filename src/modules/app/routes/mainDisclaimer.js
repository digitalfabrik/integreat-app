// @flow

import { createAction } from 'redux-actions'
import type { Action } from 'redux-first-router/dist/flow-types'

export const MAIN_DISCLAIMER_ROUTE = 'MAIN_DISCLAIMER'

export const goToMainDisclaimer = (): Action => createAction(MAIN_DISCLAIMER_ROUTE)()

/**
 * MainDisclaimerRoute, matches /disclaimer
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
export const mainDisclaimerRoute = '/disclaimer'
