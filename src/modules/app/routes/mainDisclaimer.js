// @flow

import { createAction } from 'redux-actions'

export const MAIN_DISCLAIMER_ROUTE = 'MAIN_DISCLAIMER'

export const goToMainDisclaimer = () => createAction(MAIN_DISCLAIMER_ROUTE)()

export const mainDisclaimerRoute = '/disclaimer'
