// @flow

import { RouteConfigInterface } from './RouteConfigInterface'
import extrasEndpoint from '../../endpoint/endpoints/extras'
import type { Dispatch, GetState, Route } from 'redux-first-router'
import fetchData from '../fetchData'
import type { AllPayloadsType, GetLanguageChangePathParamsType, GetPageTitleParamsType } from './RouteConfigInterface'
import Payload from '../../endpoint/Payload'
import ExtraModel from '../../endpoint/models/ExtraModel'

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

class ExtrasRouteConfig implements RouteConfigInterface<ExtrasRouteParamsType, RequiredPayloadsType> {
  name = EXTRAS_ROUTE
  route = extrasRoute

  getRoutePath = ({city, language}: ExtrasRouteParamsType): string => `/${city}/${language}/extras`

  getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadsType => ({extras: payloads.extrasPayload})

  getLanguageChangePath = ({location, language}: GetLanguageChangePathParamsType) =>
    this.getRoutePath({city: location.payload.city, language})

  getPageTitle = ({t, cityName}: GetPageTitleParamsType) => `${t('pageTitles.extras')} - ${cityName}`
}

export default ExtrasRouteConfig
