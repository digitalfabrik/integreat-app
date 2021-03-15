// @flow

import type { AllPayloadsType } from './RouteConfig'
import { RouteConfig } from './RouteConfig'
import type { Route } from 'redux-first-router'
import fetchData from '../fetchData'
import {
  createCitiesEndpoint,
  createDisclaimerEndpoint,
  createEventsEndpoint,
  createLanguagesEndpoint,
  PageModel,
  Payload
} from 'api-client'
import { cmsApiBaseUrl } from '../constants/urls'
import type { StateType } from '../StateType'

type DisclaimerRouteParamsType = {| city: string, language: string |}
type RequiredPayloadsType = {| disclaimer: Payload<PageModel> |}

export const DISCLAIMER_ROUTE = 'DISCLAIMER'

/**
 * DisclaimerRoute (for city specific disclaimers), matches /augsburg/de/disclaimer
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
const disclaimerRoute: Route = {
  path: '/:city/:language/disclaimer',
  thunk: async (dispatch, getState) => {
    const state: StateType = getState()
    const { city, language } = state.location.payload

    await Promise.all([
      fetchData(createCitiesEndpoint(cmsApiBaseUrl), dispatch, state.cities),
      fetchData(createEventsEndpoint(cmsApiBaseUrl), dispatch, state.events, { city, language }),
      fetchData(createLanguagesEndpoint(cmsApiBaseUrl), dispatch, state.languages, { city, language }),
      fetchData(createDisclaimerEndpoint(cmsApiBaseUrl), dispatch, state.disclaimer, { city, language })
    ])
  }
}

class DisclaimerRouteConfig implements RouteConfig<DisclaimerRouteParamsType, RequiredPayloadsType> {
  name = DISCLAIMER_ROUTE
  route = disclaimerRoute
  isLocationLayoutRoute = true
  requiresHeader = true
  requiresFooter = true

  getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadsType => ({
    disclaimer: payloads.disclaimerPayload
  })

  getLanguageChangePath = ({ location, language }) => this.getRoutePath({ city: location.payload.city, language })

  getPageTitle = ({ t, cityName }) => (cityName ? `${t('pageTitles.disclaimer')} - ${cityName}` : null)

  getRoutePath = ({ city, language }: DisclaimerRouteParamsType): string => `/${city}/${language}/disclaimer`

  getMetaDescription = () => null

  getFeedbackTargetInformation = ({ payloads }) => {
    const disclaimer = payloads.disclaimer.data
    return disclaimer ? { path: disclaimer.path } : null
  }
}

export default DisclaimerRouteConfig
