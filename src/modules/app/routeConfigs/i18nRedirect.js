// @flow

import RouteConfig from './RouteConfig'
import citiesEndpoint from '../../endpoint/endpoints/cities'
import type { Dispatch, GetState, Route } from 'redux-first-router'
import fetchData from '../fetchData'
import Payload from '../../endpoint/Payload'
import CityModel from '../../endpoint/models/CityModel'
import type { AllPayloadsType } from './RouteConfig'

type I18nRedirectRouteParamsType = {|param?: string|}
type RequiredPayloadsType = {|cities: Payload<Array<CityModel>>|}

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

const getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadsType => ({cities: payloads.citiesPayload})

class I18nRedirectRouteConfig extends RouteConfig<I18nRedirectRouteParamsType, RequiredPayloadsType> {
  constructor () {
    super({
      name: I18N_REDIRECT_ROUTE,
      route: i18nRedirectRoute,
      getRoutePath: getI18nRedirectPath,
      getPageTitle: () => '',
      getLanguageChangePath: () => null,
      getRequiredPayloads
    })
  }
}

export default I18nRedirectRouteConfig
