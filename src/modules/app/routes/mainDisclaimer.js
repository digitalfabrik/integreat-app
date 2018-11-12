// @flow

import MainDisclaimerPage from '../../../routes/main-disclaimer/components/MainDisclaimerPage'
import React from 'react'
import Route from './Route'

export const MAIN_DISCLAIMER_ROUTE = 'MAIN_DISCLAIMER'

const getRoutePath = (): string => '/disclaimer'

const renderMainDisclaimerPage = () => <MainDisclaimerPage />

/**
 * MainDisclaimerRoute, matches /disclaimer
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
const mainDisclaimerRoute = '/disclaimer'

export default new Route<void, void>({
  name: MAIN_DISCLAIMER_ROUTE,
  getRoutePath,
  renderPage: renderMainDisclaimerPage,
  route: mainDisclaimerRoute,
  getRequiredPayloads: () => {}
})
