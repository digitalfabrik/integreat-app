// @flow

import React from 'react'
import RouteConfig from './RouteConfig'
import type { AllPayloadsType, GetLanguageChangePathParamsType, GetPageTitleParamsType } from './types'
import Payload from '../../../endpoint/Payload'
import PageModel from '../../../endpoint/models/PageModel'
import DisclaimerPage from '../../../../routes/disclaimer/containers/DisclaimerPage'
import type { Dispatch, GetState, Route } from 'redux-first-router'
import fetchData from '../../fetchData'
import disclaimerEndpoint from '../../../endpoint/endpoints/disclaimer'

type RequiredPayloadType = {|disclaimer: Payload<PageModel>|}
type DisclaimerRouteParamsType = {|city: string, language: string|}

export const DISCLAIMER_ROUTE = 'DISCLAIMER'

const getDisclaimerPath = ({city, language}: DisclaimerRouteParamsType): string =>
  `/${city}/${language}/disclaimer`

/**
 * DisclaimerRoute (for city specific disclaimers), matches /augsburg/de/disclaimer
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
const disclaimerRoute: Route = {
  path: '/:city/:language/disclaimer',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const {city, language} = state.location.payload

    await fetchData(disclaimerEndpoint, dispatch, state.disclaimer, {city, language})
  }
}

const renderDisclaimerPage = ({disclaimer}: RequiredPayloadType) =>
  <DisclaimerPage disclaimer={disclaimer.data} />

const getRequiredPayloads = (payloads: AllPayloadsType) =>
  ({disclaimer: payloads.disclaimerPayload})

const getLanguageChangePath = ({location, language}: GetLanguageChangePathParamsType) =>
  getDisclaimerPath({city: location.payload.city, language})

const getPageTitle = ({t, cityName}: GetPageTitleParamsType) =>
  `${t('pageTitles.disclaimer')} - ${cityName}`

class DisclaimerRouteConfig extends RouteConfig<RequiredPayloadType, DisclaimerRouteParamsType> {
  constructor () {
    super({
      name: DISCLAIMER_ROUTE,
      route: disclaimerRoute,
      getRoutePath: getDisclaimerPath,
      getRequiredPayloads,
      getLanguageChangePath,
      getPageTitle
    })
  }
}

export default DisclaimerRouteConfig
