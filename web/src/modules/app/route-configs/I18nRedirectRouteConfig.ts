// @flow

import type { AllPayloadsType } from './RouteConfig'
import { RouteConfig } from './RouteConfig'
import { CityModel, createCitiesEndpoint, Payload } from 'api-client'
import type { Route } from 'redux-first-router'
import fetchData from '../fetchData'
import { cmsApiBaseUrl } from '../constants/urls'
import type { StateType } from '../StateType'

type I18nRedirectRouteParamsType = {| param?: string |}
type RequiredPayloadsType = {| cities: Payload<Array<CityModel>> |}

export const I18N_REDIRECT_ROUTE = 'I18N_REDIRECT'

/**
 * I18nRoute to redirect if no language is specified or to the not found route if the param is invalid.
 * Matches / and /param
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
const i18nRedirectRoute: Route = {
  path: '/:param?',
  thunk: async (dispatch, getState) => {
    const state: StateType = getState()

    await fetchData(createCitiesEndpoint(cmsApiBaseUrl), dispatch, state.cities)
  }
}

class I18nRedirectRouteConfig implements RouteConfig<I18nRedirectRouteParamsType, RequiredPayloadsType> {
  name = I18N_REDIRECT_ROUTE
  route = i18nRedirectRoute
  isLocationLayoutRoute = false
  requiresHeader = false
  requiresFooter = false

  getRoutePath = ({ param }: I18nRedirectRouteParamsType): string => `/${param || ''}`

  getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadsType => ({ cities: payloads.citiesPayload })

  getPageTitle = () => null

  getLanguageChangePath = () => null

  getMetaDescription = () => null

  getFeedbackTargetInformation = () => null
}

export default I18nRedirectRouteConfig
