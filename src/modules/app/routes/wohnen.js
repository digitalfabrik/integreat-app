// @flow

import extrasEndpoint from '../../endpoint/endpoints/extras'
import wohnenEndpoint from '../../endpoint/endpoints/wohnen'
import type { Dispatch, GetState, Route as RouterRouteType } from 'redux-first-router'
import ExtraModel from '../../endpoint/models/ExtraModel'
import WohnenExtraPage from '../../../routes/wohnen/containers/WohnenExtraPage'
import React from 'react'
import Payload from '../../endpoint/Payload'
import WohnenOfferModel from '../../endpoint/models/WohnenOfferModel'
import Route from './Route'
import type { AllPayloadsType, GetLanguageChangePathParamsType, GetPageTitleParamsType } from './types'
import fetchData from '../fetchData'

type RequiredPayloadType = {|extras: Payload<Array<ExtraModel>>, offers: Payload<Array<WohnenOfferModel>>|}
type RouteParamsType = {|city: string, language: string, offerHash?: string|}

export const WOHNEN_ROUTE = 'WOHNEN'
export const WOHNEN_EXTRA = 'wohnen'

const getRoutePath = ({city, language, offerHash}: RouteParamsType): string =>
  `/${city}/${language}/extras/${WOHNEN_EXTRA}${offerHash ? `/${offerHash}` : ''}`

const renderWohnenPage = ({offers, extras}: RequiredPayloadType) =>
  <WohnenExtraPage offers={offers.data} extras={extras.data} />

const getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadType =>
  ({offers: payloads.wohnenPayload, extras: payloads.extrasPayload})

const getLanguageChangePath = ({location, language}: GetLanguageChangePathParamsType) =>
  getRoutePath({city: location.payload.city, language})

const getPageTitle = ({t, cityName}: GetPageTitleParamsType) =>
  `${t('pageTitle')} - ${cityName}`

export const route: RouterRouteType = {
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
  getLanguageChangePath,
  getPageTitle
})

export default wohnenRoute
