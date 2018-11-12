// @flow

import { createAction } from 'redux-actions'
import MainDisclaimerPage from '../../../routes/main-disclaimer/components/MainDisclaimerPage'
import React from 'react'
import Route from './Route'
import type { Action } from 'redux-first-router'

const MAIN_DISCLAIMER_ROUTE = 'MAIN_DISCLAIMER'

const goToMainDisclaimer = (): Action => createAction<string, void>(MAIN_DISCLAIMER_ROUTE)()

const renderMainDisclaimerPage = () => <MainDisclaimerPage />

/**
 * MainDisclaimerRoute, matches /disclaimer
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
const mainDisclaimerRoute = '/disclaimer'

export default new Route<void, void>({
  name: MAIN_DISCLAIMER_ROUTE,
  goToRoute: goToMainDisclaimer,
  renderPage: renderMainDisclaimerPage,
  route: mainDisclaimerRoute,
  getRequiredPayloads: () => {}
})
