// @flow

import extrasEndpoint from '../../endpoint/endpoints/extras'
import type { Dispatch, GetState, Route as RouterRouteType } from 'redux-first-router'
import ExtraModel from '../../endpoint/models/ExtraModel'
import ExtrasPage from '../../../routes/extras/containers/ExtrasPage'
import React from 'react'
import Payload from '../../endpoint/Payload'
import type { AllPayloadsType, GetLanguageChangePathParamsType, GetPageTitleParamsType } from './types'
import Route from './Route'
import fetchData from '../fetchData'

type RequiredPayloadType = {|extras: Payload<Array<ExtraModel>>|}
type RouteParamsType = {|city: string, language: string|}

export const EXTRAS_ROUTE = 'EXTRAS'

const getRoutePath = ({city, language}: RouteParamsType): string => `/${city}/${language}/extras`

const renderExtrasPage = ({extras}: RequiredPayloadType) =>
  <ExtrasPage extras={extras.data} />

const getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadType =>
  ({extras: payloads.extrasPayload})

const getLanguageChangePath = ({location, language}: GetLanguageChangePathParamsType) =>
  getRoutePath({city: location.payload.city, language})

const getPageTitle = ({t, cityName}: GetPageTitleParamsType) =>
  `${t('pageTitle')} - ${cityName}`

/**
 * ExtrasRoute, matches /augsburg/de/extras and /augsburg/de/extras
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
export const route: RouterRouteType = {
  path: '/:city/:language/extras/:extraId?',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const {city, language} = state.location.payload

    await fetchData(extrasEndpoint, dispatch, state.extras, {city, language})
  }
}

const extrasRoute: Route<RequiredPayloadType, RouteParamsType> = new Route({
  name: EXTRAS_ROUTE,
  getRoutePath,
  renderPage: renderExtrasPage,
  route,
  getRequiredPayloads,
  getLanguageChangePath,
  getPageTitle
})

export default extrasRoute
