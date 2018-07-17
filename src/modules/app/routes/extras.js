// @flow

import extrasEndpoint from '../../endpoint/endpoints/extras'
import sprungbrettEndpoint from '../../endpoint/endpoints/sprungbrettJobs'
import { createAction } from 'redux-actions'

import type { Action, Dispatch, GetState } from 'redux-first-router/dist/flow-types'
import ExtraModel from '../../endpoint/models/ExtraModel'

export const EXTRAS_ROUTE = 'EXTRAS'

export const goToExtras = (city: string, language: string, extraAlias: ?string): Action =>
  createAction(EXTRAS_ROUTE)({city, language, extraAlias})

export const getExtraPath = (city: string, language: string, extraAlias: ?string): string =>
  `/${city}/${language}/extras${extraAlias ? `/${extraAlias}` : ''}`

/**
 * ExtrasRoute, matches /augsburg/de/extras and /augsburg/de/extras/sprungbrett
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
export const extrasRoute = {
  path: '/:city/:language/extras/:extraAlias?',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const {city, language, extraAlias} = state.location.payload

    const extrasPayload = await extrasEndpoint.loadData(dispatch, state.extras, {city, language})

    // https://github.com/gajus/eslint-plugin-flowtype/issues/342
    // if (Array.isArray(extrasPayload.data) && extrasPayload.data instanceof Array<ExtraModel>) {
    if (Array.isArray(extrasPayload.data)) {
      if (extraAlias === 'sprungbrett') {
        // $FlowFixMe
        const sprungbrettModel: ExtraModel = extrasPayload.data
          .find(extra => extra instanceof ExtraModel && extra.alias === extraAlias)
        if (sprungbrettModel) {
          await sprungbrettEndpoint.loadData(dispatch, state.sprungbrettJobs, {city, language, url: sprungbrettModel.path})
        }
      }
    }
  }
}
