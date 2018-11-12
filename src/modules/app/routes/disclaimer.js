// @flow

import disclaimerEndpoint from '../../endpoint/endpoints/disclaimer'
import { createAction } from 'redux-actions'

import type { Dispatch, GetState, Action } from 'redux-first-router'
import CityModel from '../../endpoint/models/CityModel'
import PageModel from '../../endpoint/models/PageModel'
import DisclaimerPage from '../../../routes/disclaimer/containers/DisclaimerPage'
import React from 'react'
import Route from './Route'
import Payload from '../../endpoint/Payload'
import type { AllPayloadsType } from './types'

type RequiredPayloadType = {|disclaimer: Payload<PageModel>, cities: Payload<Array<CityModel>>|}

const DISCLAIMER_ROUTE = 'DISCLAIMER'

const goToDisclaimer = (city: string, language: string): Action => createAction(DISCLAIMER_ROUTE)({city, language})

const renderDisclaimerPage = ({disclaimer, cities}: RequiredPayloadType) =>
  <DisclaimerPage disclaimer={disclaimer} cities={cities} />

const getRequiredPayloads = (payloads: AllPayloadsType) =>
  ({disclaimer: payloads.disclaimerPayload, cities: payloads.citiesPayload})

/**
 * DisclaimerRoute (for city specific disclaimers), matches /augsburg/de/disclaimer
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
const disclaimerRoute = {
  path: '/:city/:language/disclaimer',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const {city, language} = state.location.payload

    await disclaimerEndpoint.loadData(dispatch, state.disclaimer, {city, language})
  }
}

export default new Route<RequiredPayloadType, city: string, language: string>({
  name: DISCLAIMER_ROUTE,
  goToRoute: goToDisclaimer,
  getLanguageChangeAction: goToDisclaimer,
  renderPage: renderDisclaimerPage,
  route: disclaimerRoute,
  getRequiredPayloads
})
