// @flow

import { RouteConfigInterface } from './RouteConfigInterface'
import citiesEndpoint from '../../endpoint/endpoints/cities'
import type { Dispatch, GetState, Route } from 'redux-first-router'
import fetchData from '../fetchData'
import Payload from '../../endpoint/Payload'
import CityModel from '../../endpoint/models/CityModel'
import type { AllPayloadsType } from './RouteConfigInterface'

type I18nRedirectRouteParamsType = {|param?: string|}
type RequiredPayloadsType = {|cities: Payload<Array<CityModel>>|}

export const I18N_REDIRECT_ROUTE = 'I18N_REDIRECT'

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

class I18nRedirectRouteConfig implements RouteConfigInterface<I18nRedirectRouteParamsType, RequiredPayloadsType> {
  name = I18N_REDIRECT_ROUTE
  route = i18nRedirectRoute

 getRoutePath = ({param}: I18nRedirectRouteParamsType): string => `/${param || ''}`

  getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadsType => ({cities: payloads.citiesPayload})

  getPageTitle = () => ''

  getLanguageChangePath = () => null
}

export default I18nRedirectRouteConfig
