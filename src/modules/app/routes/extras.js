// @flow

import { extrasFetcher, locationLayoutFetcher, sprungbrettFetcher } from '../../endpoint/fetchers'
import { createAction } from 'redux-actions'

import type { Dispatch, GetState } from 'redux-first-router/dist/flow-types'

export const EXTRAS_ROUTE = 'EXTRAS'
export const goToExtras = (city: string, language: string, extraAlias: ?string) =>
  createAction(EXTRAS_ROUTE)({city, language, extraAlias})

export const extrasRoute = {
  path: '/:city/:language/extras/:extraAlias?',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const {city, language, extraAlias} = state.location.payload
    const prev = state.location.prev
    await locationLayoutFetcher(dispatch, getState)

    let extras = state.extras
    if (!extras || prev.payload.city !== city || prev.payload.language !== language) {
      extras = await extrasFetcher(dispatch, {city, language})
    }

    if (extraAlias === 'sprungbrett') {
      const sprungbrettModel = extras.find(_extra => _extra.alias === extraAlias)
      if (sprungbrettModel) {
        if (!state.sprungbrett) {
          await sprungbrettFetcher(dispatch, {url: sprungbrettModel.path})
        }
      }
    }
  }
}
