// @flow

import { extrasEndpoint, wohnenEndpoint, ExtraModel } from '@integreat-app/integreat-api-client'
import { createAction } from 'redux-actions'
import type { Dispatch, GetState, Route } from 'redux-first-router'
import fetchData from '../fetchData'

export const WOHNEN_ROUTE = 'WOHNEN'
export const WOHNEN_EXTRA = 'wohnen'

export const goToWohnenExtra = (city: string, language: string, offerHash: string) =>
  createAction<string, { city: string, language: string }>(WOHNEN_ROUTE)({city, language, offerHash})

export const getWohnenExtraPath = (city: string, language: string, offerHash?: string): string =>
  `/${city}/${language}/extras/${WOHNEN_EXTRA}${offerHash ? `/${offerHash}` : ''}`

export const wohnenRoute: Route = {
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
