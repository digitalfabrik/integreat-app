// @flow

import { createAction } from 'redux-actions'
import type { Route } from 'redux-first-router'

export const MAIN_DISCLAIMER_ROUTE = 'MAIN_DISCLAIMER'

export const goToMainDisclaimer = () => createAction<string, void>(MAIN_DISCLAIMER_ROUTE)()

/**
 * MainDisclaimerRoute, matches /disclaimer
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
export const mainDisclaimerRoute: Route = '/disclaimer'
