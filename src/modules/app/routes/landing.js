// @flow

import citiesEndpoint from '../../endpoint/endpoints/cities'
import { createAction } from 'redux-actions'

import type { Dispatch, GetState, Route } from 'redux-first-router'
import CityModel from '../../endpoint/models/CityModel'
import LandingPage from '../../../routes/landing/containers/LandingPage'
import React from 'react'

export const LANDING_ROUTE = 'LANDING'

export const goToLanding = (language: string) => createAction(LANDING_ROUTE)({language})

export const renderLandingPage = (props: {|cities: Array<CityModel>|}) =>
  <LandingPage {...props} />

/**
 * LandingRoute, matches /landing/de
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
export const landingRoute: Route = {
  path: '/landing/:language',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    await citiesEndpoint.loadData(dispatch, getState().cities)
  }
}
