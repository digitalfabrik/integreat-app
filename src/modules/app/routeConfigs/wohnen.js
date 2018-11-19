// @flow

import React from 'react'
import type { AllPayloadsType, GetLanguageChangePathParamsType, GetPageTitleParamsType } from './types'
import Payload from '../../endpoint/Payload'
import ExtraModel from '../../endpoint/models/ExtraModel'
import WohnenOfferModel from '../../endpoint/models/WohnenOfferModel'
import RouteConfig from './RouteConfig'
import WohnenExtraPage from '../../../routes/wohnen/containers/WohnenExtraPage'
import extrasEndpoint from '../../endpoint/endpoints/extras'
import type { Dispatch, GetState, Route } from 'redux-first-router'
import fetchData from '../fetchData'
import wohnenEndpoint from '../../endpoint/endpoints/wohnen'

type RequiredPayloadType = {|extras: Payload<Array<ExtraModel>>, offers: Payload<Array<WohnenOfferModel>>|}
type RouteParamsType = {|city: string, language: string, offerHash?: string|}

export const WOHNEN_ROUTE = 'WOHNEN'
export const WOHNEN_EXTRA = 'wohnen'

const getWohnenPath = ({city, language, offerHash}: RouteParamsType): string =>
  `/${city}/${language}/extras/${WOHNEN_EXTRA}${offerHash ? `/${offerHash}` : ''}`

const wohnenRoute: Route = {
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
const renderWohnenPage = ({offers, extras}: RequiredPayloadType) =>
  <WohnenExtraPage offers={offers.data} extras={extras.data} />

const getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadType =>
  ({offers: payloads.wohnenPayload, extras: payloads.extrasPayload})

const getLanguageChangePath = ({location, language}: GetLanguageChangePathParamsType) =>
  getWohnenPath({city: location.payload.city, language})

const getPageTitle = ({t, cityName}: GetPageTitleParamsType) =>
  `${t('pageTitles.wohnen')} - ${cityName}`

class WohnenRouteConfig extends RouteConfig<RequiredPayloadType, RouteParamsType> {
  constructor () {
    super({
      name: WOHNEN_ROUTE,
      route: wohnenRoute,
      getRoutePath: getWohnenPath,
      getRequiredPayloads,
      getLanguageChangePath,
      getPageTitle
    })
  }
}

export default WohnenRouteConfig
