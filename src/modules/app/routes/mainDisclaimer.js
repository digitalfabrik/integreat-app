// @flow

import { createAction } from 'redux-actions'
import type { Route } from 'redux-first-router'
import MainDisclaimerPage from '../../../routes/main-disclaimer/components/MainDisclaimerPage'
import React from 'react'

export const MAIN_DISCLAIMER_ROUTE = 'MAIN_DISCLAIMER'

export const goToMainDisclaimer = () => createAction(MAIN_DISCLAIMER_ROUTE)()

export const renderMainDisclaimerPage = () => <MainDisclaimerPage />

/**
 * MainDisclaimerRoute, matches /disclaimer
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
export const mainDisclaimerRoute: Route = '/disclaimer'
