// @flow

import extrasEndpoint from '../../endpoint/endpoints/extras'
import wohnenEndpoint from '../../endpoint/endpoints/wohnen'
import type { Dispatch, GetState, Route } from 'redux-first-router'
import ExtraModel from '../../endpoint/models/ExtraModel'
import fetchData from '../fetchData'

type RouteParamsType = {|city: string, language: string, offerHash?: string|}

export const WOHNEN_ROUTE = 'WOHNEN'
export const WOHNEN_EXTRA = 'wohnen'

export const getWohnenPath = ({city, language, offerHash}: RouteParamsType): string =>
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

export default wohnenRoute
