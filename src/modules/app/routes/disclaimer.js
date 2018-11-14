// @flow

import disclaimerEndpoint from '../../endpoint/endpoints/disclaimer'
import type { Dispatch, GetState, Route as RouterRouteType } from 'redux-first-router'
import PageModel from '../../endpoint/models/PageModel'
import DisclaimerPage from '../../../routes/disclaimer/containers/DisclaimerPage'
import React from 'react'
import Route from './Route'
import Payload from '../../endpoint/Payload'
import type { AllPayloadsType, GetLanguageChangePathParamsType, GetPageTitleParamsType } from './types'
import fetchData from '../fetchData'

type RequiredPayloadType = {|disclaimer: Payload<PageModel>|}
type RouteParamsType = {|city: string, language: string|}

export const DISCLAIMER_ROUTE = 'DISCLAIMER'

const getRoutePath = ({city, language}: RouteParamsType): string => `/${city}/${language}/disclaimer`

const renderDisclaimerPage = ({disclaimer}: RequiredPayloadType) =>
  <DisclaimerPage disclaimer={disclaimer.data} />

const getRequiredPayloads = (payloads: AllPayloadsType) =>
  ({disclaimer: payloads.disclaimerPayload})

const getLanguageChangePath = ({location, language}: GetLanguageChangePathParamsType) =>
  getRoutePath({city: location.payload.city, language})

const getPageTitle = ({t, cityName}: GetPageTitleParamsType) =>
  `${t('disclaimerPageTitle')} - ${cityName}`

/**
 * DisclaimerRoute (for city specific disclaimers), matches /augsburg/de/disclaimer
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
export const route: RouterRouteType = {
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
  getLanguageChangePath,
  getPageTitle
})

export default disclaimerRoute
