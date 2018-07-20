// @flow

import extrasEndpoint from '../../endpoint/endpoints/extras'
import wohnenEndpoint from '../../endpoint/endpoints/wohnen'
import { createAction } from 'redux-actions'

import type { Dispatch, GetState } from 'redux-first-router'
import ExtraModel from '../../endpoint/models/ExtraModel'

export const WOHNEN_ROUTE = 'WOHNEN'

export const goToWohnenExtra = (city: string, language: string, offerHash: string) =>
  createAction(WOHNEN_ROUTE)({city, language, offerHash})

export const getWohnenExtraPath = (city: string, language: string, offerHash: string): string =>
  `/${city}/${language}/extras/wohnen${offerHash ? `/${offerHash}` : ''}`

export const wohnenRoute = {
  path: '/:city/:language/extras/wohnen/:offerHash?',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const {city, language} = state.location.payload

    const extrasPayload = await extrasEndpoint.loadData(dispatch, state.extras, {city, language})
    const extras: ?Array<ExtraModel> = extrasPayload.data

    if (extras) {
      const wohnenExtra: ExtraModel | void = extras.find(extra => extra.alias === 'wohnen')
      if (wohnenExtra) {
        const params = {city: 'neuburgschrobenhausenwohnraum'} // fixme: Hardcoded city
        await wohnenEndpoint.loadData(dispatch, state.wohnen, params)
      }
    }
  }
}
