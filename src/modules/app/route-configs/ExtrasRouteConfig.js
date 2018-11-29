// @flow

import { RouteConfig } from './RouteConfig'
import { extrasEndpoint, Payload, ExtraModel } from '@integreat-app/integreat-api-client'
import type { Dispatch, GetState, Route } from 'redux-first-router'
import fetchData from '../fetchData'
import type { AllPayloadsType, GetLanguageChangePathParamsType, GetPageTitleParamsType } from './RouteConfig'

type ExtrasRouteParamsType = {|city: string, language: string|}
type RequiredPayloadsType = {|extras: Payload<Array<ExtraModel>>|}

export const EXTRAS_ROUTE = 'EXTRAS'

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

class ExtrasRouteConfig implements RouteConfig<ExtrasRouteParamsType, RequiredPayloadsType> {
  name = EXTRAS_ROUTE
  route = extrasRoute
  isLocationLayoutRoute = true
  requiresHeader = true
  requiresFooter = true

  getRoutePath = ({city, language}: ExtrasRouteParamsType): string => `/${city}/${language}/extras`

  getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadsType => ({extras: payloads.extrasPayload})

  getLanguageChangePath = ({location, language}: GetLanguageChangePathParamsType<RequiredPayloadsType>) =>
    this.getRoutePath({city: location.payload.city, language})

  getPageTitle = ({t, cityName}: GetPageTitleParamsType<RequiredPayloadsType>) =>
    `${t('pageTitles.extras')} - ${cityName}`

  getMetaDescription = () => null

  getFeedbackReference = () => null
}

export default ExtrasRouteConfig
