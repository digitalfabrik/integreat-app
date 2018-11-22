// @flow

import { RouteConfigInterface } from './RouteConfigInterface'
import type { Dispatch, GetState, Route } from 'redux-first-router'
import fetchData from '../fetchData'
import poisEndpoint from '../../endpoint/endpoints/pois'
import type { AllPayloadsType, GetLanguageChangePathParamsType, GetPageTitleParamsType } from './RouteConfigInterface'
import Payload from '../../endpoint/Payload'
import PoiModel from '../../endpoint/models/PoiModel'

type PoisRouteParamsType = {|city: string, language: string|}
type RequiredPayloadsType = {|pois: Payload<Array<PoiModel>>|}

export const POIS_ROUTE = 'POI'

const poisRoute: Route = {
  path: '/:city/:language/locations/:poiId?',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const {city, language} = state.location.payload

    await fetchData(poisEndpoint, dispatch, state.pois, {city, language})
  }
}

class PoisRouteConfig implements RouteConfigInterface<PoisRouteParamsType, RequiredPayloadsType> {
  name = POIS_ROUTE
  route = poisRoute

  getRoutePath = ({city, language}: PoisRouteParamsType): string => `/${city}/${language}/locations`

  getLanguageChangePath = ({location, pois, language}: GetLanguageChangePathParamsType) => {
    const {city, poiId} = location.payload
    if (pois && poiId) {
      const poi = pois.find(_poi => _poi.path === location.pathname)
      return (poi && poi.availableLanguages.get(language)) || null
    }
    return this.getRoutePath({city, language: language})
  }

  getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadsType => ({pois: payloads.poisPayload})

  getPageTitle = ({cityName, pois, t}: GetPageTitleParamsType) => {
    const poi = pois && pois.find(poi => poi.path === location.pathname)
    return `${poi ? poi.title : t('pageTitles.pois')} - ${cityName}`
  }
}

export default PoisRouteConfig
