// @flow

import extrasFetcher from '../../endpoint/endpoints/extras'
import sprungbrettFetcher from '../../endpoint/endpoints/sprungbrettJobs'
import { createAction } from 'redux-actions'

import type { Dispatch, GetState } from 'redux-first-router/dist/flow-types'

export const EXTRAS_ROUTE = 'EXTRAS'
export const goToExtras = (city: string, language: string, extraAlias: ?string) =>
  createAction(EXTRAS_ROUTE)({city, language, extraAlias})

/**
 * ExtrasRoute, matches /augsburg/de/extras and /augsburg/de/extras/sprungbrett
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
export const extrasRoute = {
  path: '/:city/:language/extras/:extraAlias?',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const {city, language, extraAlias} = state.location.payload

    const extrasPayload = await extrasFetcher.fetchData(dispatch, state.extras, {city, language})

    if (!extrasPayload) {
      // todo error handling
    }

    if (extraAlias === 'sprungbrett') {
      const sprungbrettModel = extrasPayload.data.find(_extra => _extra.alias === extraAlias)
      if (sprungbrettModel) {
        await sprungbrettFetcher.fetchData(dispatch, state.sprungbrettJobs, {url: sprungbrettModel.path})
      }
    }
  }
}
