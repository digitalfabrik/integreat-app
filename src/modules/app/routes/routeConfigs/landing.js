// @flow

import React from 'react'
import Payload from '../../../endpoint/Payload'
import CityModel from '../../../endpoint/models/CityModel'
import type { AllPayloadsType, GetPageTitleParamsType } from './types'
import RouteConfig from './RouteConfig'
import LandingPage from '../../../../routes/landing/containers/LandingPage'
import citiesEndpoint from '../../../endpoint/endpoints/cities'
import type { Dispatch, GetState, Route } from 'redux-first-router'
import fetchData from '../../fetchData'

type RequiredPayloadType = {|cities: Payload<Array<CityModel>>|}
type LandingRouteParamsType = {|language: string|}

export const LANDING_ROUTE = 'LANDING'

const getLandingPath = ({language}: LandingRouteParamsType): string => `/landing/${language}`

/**
 * LandingRoute, matches /landing/de
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
const landingRoute: Route = {
  path: '/landing/:language',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    await fetchData(citiesEndpoint, dispatch, getState().cities)
  }
}

const renderLandingPage = ({cities}: RequiredPayloadType) =>
  <LandingPage cities={cities.data} />

const getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadType => ({cities: payloads.citiesPayload})

const getPageTitle = ({t}: GetPageTitleParamsType) => t('pageTitles.landing')

class LandingRouteConfig extends RouteConfig<RequiredPayloadType, LandingRouteParamsType> {
  constructor () {
    super({
      name: LANDING_ROUTE,
      route: landingRoute,
      getRoutePath: getLandingPath,
      getRequiredPayloads,
      getPageTitle,
      getLanguageChangePath: () => null
    })
  }
}

export default LandingRouteConfig
