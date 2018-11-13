// @flow

import extrasEndpoint from '../../endpoint/endpoints/extras'
import wohnenEndpoint from '../../endpoint/endpoints/wohnen'
import type { Dispatch, GetState, Route as RouterRouteType } from 'redux-first-router'
import ExtraModel from '../../endpoint/models/ExtraModel'
import CityModel from '../../endpoint/models/CityModel'
import WohnenExtraPage from '../../../routes/wohnen/containers/WohnenExtraPage'
import React from 'react'
import Payload from '../../endpoint/Payload'
import WohnenOfferModel from '../../endpoint/models/WohnenOfferModel'
import Route from './Route'
import type { AllPayloadsType, GetLanguageChangePathParamsType } from './types'
import fetchData from '../fetchData'

type RequiredPayloadType = {|extras: Payload<Array<ExtraModel>>, offers: Payload<Array<WohnenOfferModel>>,
  cities: Payload<Array<CityModel>>|}
type RouteParamsType = {|city: string, language: string, offerHash?: string|}

export const WOHNEN_ROUTE = 'WOHNEN'
export const WOHNEN_EXTRA = 'wohnen'

const getRoutePath = ({city, language, offerHash}: RouteParamsType): string =>
  `/${city}/${language}/extras/${WOHNEN_EXTRA}${offerHash ? `/${offerHash}` : ''}`

const renderWohnenPage =  ({offers, extras, cities}: RequiredPayloadType) =>
  <WohnenExtraPage offers={offers.data} extras={extras.data} cities={cities.data} />

const getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadType =>
  ({offers: payloads.wohnenPayload, cities: payloads.citiesPayload, extras: payloads.extrasPayload})

const getLanguageChangePath = ({location}: GetLanguageChangePathParamsType) =>
  getRoutePath({city: location.payload.city, language: location.payload.language})

const route: RouterRouteType = {
  path: `/:city/:language/extras/${WOHNEN_EXTRA}/:offerHash?`,
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const {city, language} = state.location.payload

    const extrasPayload = await fetchData(extrasEndpoint, dispatch, state.extras, {city, language})
    const extras: ?Array<ExtraModel> = extrasPayload.data

    if (extras) {
      const wohnenExtra: ExtraModel | void = extras.find(extra => extra.alias === WOHNEN_EXTRA)
      if (wohnenExtra && wohnenExtra.postData) {
        const params = {city: wohnenExtra.postData.get('api-name')}
        await fetchData(wohnenEndpoint, dispatch, state.wohnen, params)
      }
    }
  }
}

const wohnenRoute: Route<RequiredPayloadType, RouteParamsType> = new Route({
  name: WOHNEN_ROUTE,
  getRoutePath,
  renderPage: renderWohnenPage,
  route,
  getRequiredPayloads,
  getLanguageChangePath
})

export default wohnenRoute
