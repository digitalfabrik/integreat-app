// @flow

import { RouteConfig } from './RouteConfig'
import type { Route } from 'redux-first-router'
import fetchData from '../fetchData'
import { disclaimerEndpoint, Payload, PageModel } from '@integreat-app/integreat-api-client'
import type {
  AllPayloadsType,
  GetFeedbackReferenceType,
  GetLanguageChangePathParamsType,
  GetPageTitleParamsType
} from './RouteConfig'

type DisclaimerRouteParamsType = {|city: string, language: string|}
type RequiredPayloadsType = {|disclaimer: Payload<PageModel>|}

export const DISCLAIMER_ROUTE = 'DISCLAIMER'

/**
 * DisclaimerRoute (for city specific disclaimers), matches /augsburg/de/disclaimer
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
const disclaimerRoute: Route = {
  path: '/:city/:language/disclaimer',
  thunk: async (dispatch, getState) => {
    const state = getState()
    const {city, language} = state.location.payload

    await fetchData(disclaimerEndpoint, dispatch, state.disclaimer, {city, language})
  }
}

class DisclaimerRouteConfig implements RouteConfig<DisclaimerRouteParamsType, RequiredPayloadsType> {
  name = DISCLAIMER_ROUTE
  route = disclaimerRoute
  isLocationLayoutRoute = true
  requiresHeader = true
  requiresFooter = true

  getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadsType =>
    ({disclaimer: payloads.disclaimerPayload})

  getLanguageChangePath = ({location, language}: GetLanguageChangePathParamsType<RequiredPayloadsType>) =>
    this.getRoutePath({city: location.payload.city, language})

  getPageTitle = ({t, cityName}: GetPageTitleParamsType<RequiredPayloadsType>) =>
    `${t('pageTitles.disclaimer')} - ${cityName}`

  getRoutePath = ({city, language}: DisclaimerRouteParamsType): string =>
    `/${city}/${language}/disclaimer`

  getMetaDescription = () => null

  getFeedbackReference = ({payloads}: GetFeedbackReferenceType<RequiredPayloadsType>) => {
    const disclaimer = payloads.disclaimer.data
    return disclaimer ? {id: disclaimer.id} : null
  }
}

export default DisclaimerRouteConfig
