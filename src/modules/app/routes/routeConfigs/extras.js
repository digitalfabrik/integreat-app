// @flow

import React from 'react'

import type { AllPayloadsType, GetLanguageChangePathParamsType, GetPageTitleParamsType } from './types'
import RouteConfig from './RouteConfig'
import ExtrasPage from '../../../../routes/extras/containers/ExtrasPage'
import Payload from '../../../endpoint/Payload'
import ExtraModel from '../../../endpoint/models/ExtraModel'
import extrasEndpoint from '../../../endpoint/endpoints/extras'
import type { Dispatch, GetState, Route } from 'redux-first-router'
import fetchData from '../../fetchData'

type RequiredPayloadType = {|extras: Payload<Array<ExtraModel>>|}
type ExtrasRouteParamsType = {|city: string, language: string|}

export const EXTRAS_ROUTE = 'EXTRAS'

const getExtrasPath = ({city, language}: ExtrasRouteParamsType): string =>
  `/${city}/${language}/extras`

/**
 * ExtrasRoute, matches /augsburg/de/extras and /augsburg/de/extras
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
const extrasRoute: Route = {
  path: '/:city/:language/extras/:extraId?',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const {city, language} = state.location.payload

    await fetchData(extrasEndpoint, dispatch, state.extras, {city, language})
  }
}

const renderExtrasPage = ({extras}: RequiredPayloadType) =>
  <ExtrasPage extras={extras.data} />

const getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadType =>
  ({extras: payloads.extrasPayload})

const getLanguageChangePath = ({location, language}: GetLanguageChangePathParamsType) =>
  getExtrasPath({city: location.payload.city, language})

const getPageTitle = ({t, cityName}: GetPageTitleParamsType) =>
  `${t('pageTitles.extras')} - ${cityName}`

class ExtrasRouteConfig extends RouteConfig<RequiredPayloadType, ExtrasRouteParamsType> {
  constructor () {
    super({
      name: EXTRAS_ROUTE,
      route: extrasRoute,
      getRoutePath: getExtrasPath,
      getRequiredPayloads,
      getLanguageChangePath,
      getPageTitle
    })
  }
}

export default ExtrasRouteConfig
