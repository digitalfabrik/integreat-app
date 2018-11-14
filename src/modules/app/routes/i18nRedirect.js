// @flow

import citiesEndpoint from '../../endpoint/endpoints/cities'
import type { Dispatch, GetState, Route as RouterRouteType } from 'redux-first-router'
import CityModel from '../../endpoint/models/CityModel'
import I18nRedirectPage from '../../../routes/i18nRedirect/containers/I18nRedirectPage'
import React from 'react'
import Route from './Route'
import Payload from '../../endpoint/Payload'
import type { AllPayloadsType } from './types'
import fetchData from '../fetchData'

type RequiredPayloadType = {|cities: Payload<Array<CityModel>>|}
type RouteParamsType = {|param?: string|}

export const I18N_REDIRECT_ROUTE = 'I18N_REDIRECT'

const getRoutePath = ({param}: RouteParamsType): string => `/${param || ''}`

const renderI18nPage = ({cities}: RequiredPayloadType) =>
  <I18nRedirectPage cities={cities.data} />

const getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadType => ({cities: payloads.citiesPayload})

/**
 * I18nRoute to redirect if no language is specified or to the not found route if the param is invalid.
 * Matches / and /param
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
export const route: RouterRouteType = {
  path: '/:param?',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()

    await fetchData(citiesEndpoint, dispatch, state.cities)
  }
}

const i18nRedirectRoute: Route<RequiredPayloadType, RouteParamsType> = new Route({
  name: I18N_REDIRECT_ROUTE,
  getRoutePath,
  renderPage: renderI18nPage,
  route,
  getRequiredPayloads,
  getPageTitle: () => ''
})

export default i18nRedirectRoute
