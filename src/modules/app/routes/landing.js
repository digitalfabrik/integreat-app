// @flow

import citiesEndpoint from '../../endpoint/endpoints/cities'
import { createAction } from 'redux-actions'

import type { Dispatch, GetState, Action } from 'redux-first-router'
import CityModel from '../../endpoint/models/CityModel'
import LandingPage from '../../../routes/landing/containers/LandingPage'
import React from 'react'
import Route from './Route'
import Payload from '../../endpoint/Payload'
import type { AllPayloadsType } from './types'
import fetchData from '../fetchData'

type RequiredPayloadType = {|cities: Payload<Array<CityModel>>|}

const LANDING_ROUTE = 'LANDING'

const goToLanding = (language: string): Action => createAction<string, { language: string }>(LANDING_ROUTE)({language})

const renderLandingPage = ({cities}: RequiredPayloadType) =>
  <LandingPage cities={cities.data} />

const getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadType => ({cities: payloads.citiesPayload})

/**
 * LandingRoute, matches /landing/de
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
const landingRoute = {
  path: '/landing/:language',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    await fetchData(citiesEndpoint, dispatch, getState().cities)
  }
}

export default new Route<RequiredPayloadType, language: string>({
  name: LANDING_ROUTE,
  goToRoute: goToLanding,
  renderPage: renderLandingPage,
  route: landingRoute,
  getRequiredPayloads: getRequiredPayloads
})

