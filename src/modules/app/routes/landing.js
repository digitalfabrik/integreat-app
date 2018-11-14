// @flow

import citiesEndpoint from '../../endpoint/endpoints/cities'
import type { Dispatch, GetState, Route as RouterRouteType } from 'redux-first-router'
import CityModel from '../../endpoint/models/CityModel'
import LandingPage from '../../../routes/landing/containers/LandingPage'
import React from 'react'
import Route from './Route'
import Payload from '../../endpoint/Payload'
import type { AllPayloadsType, GetPageTitleParamsType } from './types'
import fetchData from '../fetchData'
import { createAction } from 'redux-actions'

type RequiredPayloadType = {|cities: Payload<Array<CityModel>>|}
type RouteParamsType = {|language: string|}

export const goToLanding = (language: string) => createAction<string, { language: string }>(LANDING_ROUTE)({language})

export const LANDING_ROUTE = 'LANDING'

const getRoutePath = ({language}: RouteParamsType): string => `/landing/${language}`

const renderLandingPage = ({cities}: RequiredPayloadType) =>
  <LandingPage cities={cities.data} />

const getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadType => ({cities: payloads.citiesPayload})

const getPageTitle = ({t}: GetPageTitleParamsType) => t('pageTitle')

/**
 * LandingRoute, matches /landing/de
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
export const route: RouterRouteType = {
  path: '/landing/:language',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    await fetchData(citiesEndpoint, dispatch, getState().cities)
  }
}

const landingRoute: Route<RequiredPayloadType, RouteParamsType> = new Route({
  name: LANDING_ROUTE,
  getRoutePath,
  renderPage: renderLandingPage,
  route,
  getRequiredPayloads,
  getPageTitle
})

export default landingRoute
