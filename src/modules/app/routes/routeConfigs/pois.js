// @flow

import React from 'react'
import type { AllPayloadsType, GetLanguageChangePathParamsType, GetPageTitleParamsType } from './types'
import RouteConfig from './RouteConfig'
import PoisPage from '../../../../routes/pois/containers/PoisPage'
import Payload from '../../../endpoint/Payload'
import PoiModel from '../../../endpoint/models/PoiModel'
import type { Dispatch, GetState, Route } from 'redux-first-router'
import fetchData from '../../fetchData'
import poisEndpoint from '../../../endpoint/endpoints/pois'

type RequiredPayloadType = {|pois: Payload<Array<PoiModel>>|}
type PoisRouteParamsType = {|city: string, language: string|}

export const POIS_ROUTE = 'POI'

const getPoisPath = ({city, language}: PoisRouteParamsType): string =>
  `/${city}/${language}/locations`

const poisRoute: Route = {
  path: '/:city/:language/locations/:poiId?',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const {city, language} = state.location.payload

    await fetchData(poisEndpoint, dispatch, state.pois, {city, language})
  }
}

const renderPoisPage = ({pois}: RequiredPayloadType) =>
  <PoisPage pois={pois.data} />

const getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadType =>
  ({pois: payloads.poisPayload})

const getLanguageChangePath = ({location, pois, language}: GetLanguageChangePathParamsType) => {
  const {city, poiId} = location.payload
  if (pois && poiId) {
    const poi = pois.find(_poi => _poi.path === location.pathname)
    return (poi && poi.availableLanguages.get(language)) || null
  }
  return getPoisPath({city, language: language})
}

const getPageTitle = ({cityName, pois, t}: GetPageTitleParamsType) => {
  const poi = pois && pois.find(poi => poi.path === location.pathname)
  return `${poi ? poi.title : t('pageTitles.pois')} - ${cityName}`
}

class PoisRouteConfig extends RouteConfig<RequiredPayloadType, PoisRouteParamsType> {
  constructor () {
    super({
      name: POIS_ROUTE,
      route: poisRoute,
      getRoutePath: getPoisPath,
      getRequiredPayloads: getRequiredPayloads,
      getLanguageChangePath,
      getPageTitle
    })
  }
}

export default PoisRouteConfig
