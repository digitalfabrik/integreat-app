// @flow

import type { Dispatch, GetState, Route as RouterRouteType } from 'redux-first-router'
import poisEndpoint from '../../endpoint/endpoints/pois'
import PoiModel from '../../endpoint/models/PoiModel'
import PoisPage from '../../../routes/pois/containers/PoisPage'
import React from 'react'
import Route from './Route'
import type { AllPayloadsType, GetLanguageChangePathParamsType, GetPageTitleParamsType } from './types'
import Payload from '../../endpoint/Payload'
import fetchData from '../fetchData'

type RequiredPayloadType = {|pois: Payload<Array<PoiModel>>|}
type RouteParamsType = {|city: string, language: string|}

export const POIS_ROUTE = 'POI'

const getRoutePath = ({city, language}: RouteParamsType): string =>
  `/${city}/${language}/locations`

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
  return poisRoute.getRoutePath({city, language: language})
}

const getPageTitle = ({cityName, pois, t}: GetPageTitleParamsType) => {
  const poi = pois && pois.find(poi => poi.path === location.pathname)
  return `${poi ? poi.title : t('pageTitle')} - ${cityName}`
}

export const route: RouterRouteType = {
  path: '/:city/:language/locations/:poiId?',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const {city, language} = state.location.payload

    await fetchData(poisEndpoint, dispatch, state.pois, {city, language})
  }
}

const poisRoute: Route<RequiredPayloadType, RouteParamsType> = new Route({
  name: POIS_ROUTE,
  getRoutePath,
  renderPage: renderPoisPage,
  route,
  getRequiredPayloads: getRequiredPayloads,
  getLanguageChangePath,
  getPageTitle
})

export default poisRoute
