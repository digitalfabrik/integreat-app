// @flow

import RouteConfig from './RouteConfig'
import extrasEndpoint from '../../endpoint/endpoints/extras'
import type { Dispatch, GetState, Route } from 'redux-first-router'
import fetchData from '../fetchData'
import type { AllPayloadsType, GetLanguageChangePathParamsType, GetPageTitleParamsType } from './RouteConfig'
import Payload from '../../endpoint/Payload'
import ExtraModel from '../../endpoint/models/ExtraModel'

type ExtrasRouteParamsType = {|city: string, language: string|}
type RequiredPayloadsType = {|extras: Payload<Array<ExtraModel>>|}

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

const getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadsType => ({extras: payloads.extrasPayload})

const getLanguageChangePath = ({location, language}: GetLanguageChangePathParamsType) =>
  getExtrasPath({city: location.payload.city, language})

const getPageTitle = ({t, cityName}: GetPageTitleParamsType) =>
  `${t('pageTitles.extras')} - ${cityName}`

class ExtrasRouteConfig extends RouteConfig<ExtrasRouteParamsType, RequiredPayloadsType> {
  constructor () {
    super({
      name: EXTRAS_ROUTE,
      route: extrasRoute,
      getRoutePath: getExtrasPath,
      getLanguageChangePath,
      getPageTitle,
      getRequiredPayloads
    })
  }
}

export default ExtrasRouteConfig
