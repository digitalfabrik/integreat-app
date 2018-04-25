// @flow

import { createAction } from 'redux-actions'

export const MAIN_DISCLAIMER_ROUTE = 'MAIN_DISCLAIMER'

export const goToMainDisclaimer = (): string => createAction(MAIN_DISCLAIMER_ROUTE)()

/**
 * MainDisclaimerRoute, matches /disclaimer
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
export const mainDisclaimerRoute = '/disclaimer'
