// @flow

import React from 'react'
import Payload from '../../../endpoint/Payload'
import CityModel from '../../../endpoint/models/CityModel'
import type { AllPayloadsType } from '../types'
import RouteConfig from './RouteConfig'
import I18nRedirectPage from '../../../../routes/i18nRedirect/containers/I18nRedirectPage'
import citiesEndpoint from '../../../endpoint/endpoints/cities'
import type { Dispatch, GetState, Route } from 'redux-first-router'
import fetchData from '../../fetchData'

type RequiredPayloadType = {|cities: Payload<Array<CityModel>>|}
type I18nRedirectRouteParamsType = {|param?: string|}

export const I18N_REDIRECT_ROUTE = 'I18N_REDIRECT'

const getI18nRedirectPath = ({param}: I18nRedirectRouteParamsType): string => `/${param || ''}`

/**
 * I18nRoute to redirect if no language is specified or to the not found route if the param is invalid.
 * Matches / and /param
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
const i18nRedirectRoute: Route = {
  path: '/:param?',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()

    await fetchData(citiesEndpoint, dispatch, state.cities)
  }
}

const renderI18nPage = ({cities}: RequiredPayloadType) =>
  <I18nRedirectPage cities={cities.data} />

const getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadType => ({cities: payloads.citiesPayload})

class I18nRedirectRouteConfig extends RouteConfig<RequiredPayloadType, I18nRedirectRouteParamsType> {
  constructor () {
    super({
      name: I18N_REDIRECT_ROUTE,
      route: i18nRedirectRoute,
      getRoutePath: getI18nRedirectPath,
      getRequiredPayloads,
      getPageTitle: () => '',
      getLanguageChangePath: () => null
    })
  }
}

export default I18nRedirectRouteConfig
