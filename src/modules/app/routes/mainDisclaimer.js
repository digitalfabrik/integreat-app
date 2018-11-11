// @flow

import { createAction } from 'redux-actions'
import MainDisclaimerPage from '../../../routes/main-disclaimer/components/MainDisclaimerPage'
import React from 'react'
import Route from './Route'

const MAIN_DISCLAIMER_ROUTE = 'MAIN_DISCLAIMER'

const goToMainDisclaimer = () => createAction(MAIN_DISCLAIMER_ROUTE)()

const renderMainDisclaimerPage = () => <MainDisclaimerPage />

/**
 * MainDisclaimerRoute, matches /disclaimer
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
const mainDisclaimerRoute = '/disclaimer'

export default new Route({
  name: MAIN_DISCLAIMER_ROUTE,
  goToRoute: goToMainDisclaimer,
  renderPage: renderMainDisclaimerPage,
  route: mainDisclaimerRoute,
  getRequiredPayloads: () => ({})
})
