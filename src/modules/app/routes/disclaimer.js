// @flow

import disclaimerEndpoint from '../../endpoint/endpoints/disclaimer'
import type { Dispatch, GetState, Route as RouterRouteType } from 'redux-first-router'
import CityModel from '../../endpoint/models/CityModel'
import PageModel from '../../endpoint/models/PageModel'
import DisclaimerPage from '../../../routes/disclaimer/containers/DisclaimerPage'
import React from 'react'
import Route from './Route'
import Payload from '../../endpoint/Payload'
import type { AllPayloadsType, GetLanguageChangePathParamsType } from './types'
import fetchData from '../fetchData'

type RequiredPayloadType = {|disclaimer: Payload<PageModel>, cities: Payload<Array<CityModel>>|}
type RouteParamsType = {|city: string, language: string|}

export const DISCLAIMER_ROUTE = 'DISCLAIMER'

const getRoutePath = ({city, language}: RouteParamsType): string => `/${city}/${language}/disclaimer`

const renderDisclaimerPage = ({disclaimer, cities}: RequiredPayloadType) =>
  <DisclaimerPage disclaimer={disclaimer.data} cities={cities.data} />

const getRequiredPayloads = (payloads: AllPayloadsType) =>
  ({disclaimer: payloads.disclaimerPayload, cities: payloads.citiesPayload})

const getLanguageChangePath = ({location}: GetLanguageChangePathParamsType) =>
  getRoutePath({city: location.payload.city, language: location.payload.language})

/**
 * DisclaimerRoute (for city specific disclaimers), matches /augsburg/de/disclaimer
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
const route: RouterRouteType = {
  path: '/:city/:language/disclaimer',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const {city, language} = state.location.payload

    await fetchData(disclaimerEndpoint, dispatch, state.disclaimer, {city, language})
  }
}

const disclaimerRoute: Route<RequiredPayloadType, RouteParamsType> = new Route({
  name: DISCLAIMER_ROUTE,
  getRoutePath,
  renderPage: renderDisclaimerPage,
  route,
  getRequiredPayloads,
  getLanguageChangePath
})

export default disclaimerRoute
