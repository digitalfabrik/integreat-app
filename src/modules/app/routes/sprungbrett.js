// @flow

import extrasEndpoint from '../../endpoint/endpoints/extras'
import sprungbrettEndpoint from '../../endpoint/endpoints/sprungbrettJobs'
import type { Dispatch, GetState, Route as RouterRouteType } from 'redux-first-router'
import ExtraModel from '../../endpoint/models/ExtraModel'
import fetchData from '../fetchData'

export const SPRUNGBRETT_ROUTE = 'SPRUNGBRETT'
export const SPRUNGBRETT_EXTRA = 'sprungbrett'

export const getSprungbrettPath = ({city, language}: {|city: string, language: string|}): string =>
  `/${city}/${language}/extras/${SPRUNGBRETT_EXTRA}`

export const sprungbrettRoute: RouterRouteType = {
  path: `/:city/:language/extras/${SPRUNGBRETT_EXTRA}`,
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const { city, language } = state.location.payload

    const extrasPayload = await fetchData(extrasEndpoint, dispatch, state.extras, { city, language })
    const extras: ?Array<ExtraModel> = extrasPayload.data

    if (extras) {
      const sprungbrettExtra: ExtraModel | void = extras.find(extra => extra.alias === SPRUNGBRETT_EXTRA)
      if (sprungbrettExtra) {
        const params = { city, language, url: sprungbrettExtra.path }
        const sprungbrettEndpoint1 = sprungbrettEndpoint

        await fetchData(sprungbrettEndpoint1, dispatch, state.sprungbrettJobs, params)
      }
    }
  }
}

export default sprungbrettRoute
