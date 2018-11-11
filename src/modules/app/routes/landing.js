// @flow

import citiesEndpoint from '../../endpoint/endpoints/cities'
import { createAction } from 'redux-actions'

import type { Dispatch, GetState } from 'redux-first-router'
import CityModel from '../../endpoint/models/CityModel'
import LandingPage from '../../../routes/landing/containers/LandingPage'
import React from 'react'
import Route from './Route'

const LANDING_ROUTE = 'LANDING'

const goToLanding = (language: string) => createAction(LANDING_ROUTE)({language})

const renderLandingPage = ({cities}: {|cities: Payload<Array<CityModel>>|}) =>
  <LandingPage cities={cities.data} />

/**
 * LandingRoute, matches /landing/de
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
const landingRoute = {
  path: '/landing/:language',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    await citiesEndpoint.loadData(dispatch, getState().cities)
  }
}

export default new Route({
  name: LANDING_ROUTE,
  goToRoute: goToLanding,
  renderPage: renderLandingPage,
  route: landingRoute,
  getRequiredPayloads: () => ({})
})

