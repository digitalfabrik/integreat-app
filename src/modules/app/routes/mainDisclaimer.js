// @flow

import { createAction } from 'redux-actions'
import MainDisclaimerPage from '../../../routes/main-disclaimer/components/MainDisclaimerPage'
import React from 'react'
import Route from './Route'
import type { Action } from 'redux-first-router'

export const MAIN_DISCLAIMER_ROUTE = 'MAIN_DISCLAIMER'

export const goToMainDisclaimer = (): Action => createAction<string, void>(MAIN_DISCLAIMER_ROUTE)()

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
