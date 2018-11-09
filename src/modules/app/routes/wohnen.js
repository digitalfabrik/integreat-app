// @flow

import extrasEndpoint from '../../endpoint/endpoints/extras'
import wohnenEndpoint from '../../endpoint/endpoints/wohnen'
import { createAction } from 'redux-actions'

import type { Dispatch, GetState, Route } from 'redux-first-router'
import ExtraModel from '../../endpoint/models/ExtraModel'
import CityModel from '../../endpoint/models/CityModel'
import WohnenOfferModel from '../../endpoint/models/WohnenOfferModel'
import WohnenExtraPage from '../../../routes/wohnen/containers/WohnenExtraPage'
import React from 'react'

export const WOHNEN_ROUTE = 'WOHNEN'
export const WOHNEN_EXTRA = 'wohnen'

export const goToWohnenExtra = (city: string, language: string, offerHash: string) =>
  createAction(WOHNEN_ROUTE)({city, language, offerHash})

export const getWohnenExtraPath = (city: string, language: string, offerHash?: string): string =>
  `/${city}/${language}/extras/${WOHNEN_EXTRA}${offerHash ? `/${offerHash}` : ''}`

export const renderWohnenPage = (props: {|offers: Array<WohnenOfferModel>, extras: Array<ExtraModel>,
  cities: Array<CityModel>|}) => <WohnenExtraPage {...props} />

export const wohnenRoute: Route = {
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
