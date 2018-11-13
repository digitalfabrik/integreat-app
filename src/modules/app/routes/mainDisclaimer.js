// @flow

import MainDisclaimerPage from '../../../routes/main-disclaimer/components/MainDisclaimerPage'
import React from 'react'
import Route from './Route'
import { Route as RouterRouteType } from 'redux-first-router'

export const MAIN_DISCLAIMER_ROUTE = 'MAIN_DISCLAIMER'

const getRoutePath = (): string => '/disclaimer'

const renderMainDisclaimerPage = () => <MainDisclaimerPage />

/**
 * MainDisclaimerRoute, matches /disclaimer
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
const route: RouterRouteType = '/disclaimer'

const mainDisclaimerRoute: Route<void, void> = new Route({
  name: MAIN_DISCLAIMER_ROUTE,
  getRoutePath,
  renderPage: renderMainDisclaimerPage,
  route,
  getRequiredPayloads: () => {}
})

export default mainDisclaimerRoute
