// @flow

import React from 'react'
import type { AllPayloadsType, GetLanguageChangePathParamsType, GetPageTitleParamsType } from '../types'
import RouteConfig from './RouteConfig'
import PoisPage from '../../../../routes/pois/containers/PoisPage'
import Payload from '../../../endpoint/Payload'
import PoiModel from '../../../endpoint/models/PoiModel'
import { getPoisPath, POIS_ROUTE } from '../pois'

type RequiredPayloadType = {|pois: Payload<Array<PoiModel>>|}

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

const poisRouteConfig: RouteConfig<RequiredPayloadType> = new RouteConfig({
  name: POIS_ROUTE,
  renderPage: renderPoisPage,
  getRequiredPayloads: getRequiredPayloads,
  getLanguageChangePath,
  getPageTitle
})

export default poisRouteConfig
