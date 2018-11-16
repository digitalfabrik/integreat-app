// @flow

import { Route } from 'redux-first-router'

export const MAIN_DISCLAIMER_ROUTE = 'MAIN_DISCLAIMER'

export const getMainDisclaimerPath = (): string => '/disclaimer'

/**
 * MainDisclaimerRoute, matches /disclaimer
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
export const mainDisclaimerRoute: Route = '/disclaimer'

export default mainDisclaimerRoute
