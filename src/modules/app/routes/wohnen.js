// @flow

import extrasEndpoint from '../../endpoint/endpoints/extras'
import wohnenEndpoint from '../../endpoint/endpoints/wohnen'
import { createAction } from 'redux-actions'

import type { Dispatch, GetState } from 'redux-first-router'
import ExtraModel from '../../endpoint/models/ExtraModel'
import CityModel from '../../endpoint/models/CityModel'
import WohnenExtraPage from '../../../routes/wohnen/containers/WohnenExtraPage'
import React from 'react'
import Payload from '../../endpoint/Payload'
import WohnenOfferModel from '../../endpoint/models/WohnenOfferModel'
import Route from './Route'
import type { AllPayloadsType } from './types'

const WOHNEN_ROUTE = 'WOHNEN'
export const WOHNEN_EXTRA = 'wohnen'

const goToWohnenExtra = (city: string, language: string, offerHash: string) =>
  createAction(WOHNEN_ROUTE)({city, language, offerHash})

const renderWohnenPage =  ({offers, extras, cities}: {|offers: Payload<Array<WohnenOfferModel>>,
  extras: Payload<Array<ExtraModel>>, cities: Payload<Array<CityModel>>|}) =>
  <WohnenExtraPage offers={offers.data} extras={extras.data} cities={cities.data} />

const getRequiredPayloads = (payloads: AllPayloadsType) =>
  ({offers: payloads.wohnenPayload, cities: payloads.citiesPayload, extras: payloads.extrasPayload})

const wohnenRoute = {
  path: `/:city/:language/extras/${WOHNEN_EXTRA}/:offerHash?`,
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const {city, language} = state.location.payload

    const extrasPayload = await extrasEndpoint.loadData(dispatch, state.extras, {city, language})
    const extras: ?Array<ExtraModel> = extrasPayload.data

    if (extras) {
      const wohnenExtra: ExtraModel | void = extras.find(extra => extra.alias === WOHNEN_EXTRA)
      if (wohnenExtra && wohnenExtra.postData) {
        const params = {city: wohnenExtra.postData.get('api-name')}
        await wohnenEndpoint.loadData(dispatch, state.wohnen, params)
      }
    }
  }
}

export default new Route({
  name: WOHNEN_ROUTE,
  goToRoute: goToWohnenExtra,
  getLanguageChangeAction: goToWohnenExtra,
  renderPage: renderWohnenPage,
  route: wohnenRoute,
  getRequiredPayloads
})
