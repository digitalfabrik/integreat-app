// @flow

import extrasEndpoint from '../../endpoint/endpoints/extras'
import sprungbrettEndpoint from '../../endpoint/endpoints/sprungbrettJobs'
import { createAction } from 'redux-actions'

import type { Dispatch, GetState } from 'redux-first-router'
import ExtraModel from '../../endpoint/models/ExtraModel'

export const EXTRAS_ROUTE = 'EXTRAS'

export const goToExtras = (city: string, language: string, internalExtra: ?string) =>
  createAction(EXTRAS_ROUTE)({city, language, internalExtra})

export const getExtraPath = (city: string, language: string, internalExtra: ?string): string =>
  `/${city}/${language}/extras${internalExtra ? `/${internalExtra}` : ''}`

/**
 * ExtrasRoute, matches /augsburg/de/extras and /augsburg/de/extras/sprungbrett
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
export const extrasRoute = {
  path: '/:city/:language/extras/:internalExtra?',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const {city, language, internalExtra} = state.location.payload

    const extrasPayload = await extrasEndpoint.loadData(dispatch, state.extras, {city, language})

    // https://github.com/gajus/eslint-plugin-flowtype/issues/342
    // if (Array.isArray(extrasPayload.data) && extrasPayload.data instanceof Array<ExtraModel>) {
    if (Array.isArray(extrasPayload.data)) {
      if (internalExtra === 'sprungbrett') {
        // $FlowFixMe
        const sprungbrettModel: ExtraModel = extrasPayload.data
          .find(extra => extra instanceof ExtraModel && extra.alias === internalExtra)
        if (sprungbrettModel) {
          await sprungbrettEndpoint.loadData(dispatch, state.sprungbrettJobs, {city, language, url: sprungbrettModel.path})
        }
      }
    }
  }
}
