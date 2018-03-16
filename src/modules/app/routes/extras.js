// @flow

import { extrasFetcher, locationLayoutFetcher, sprungbrettFetcher } from '../../endpoint/fetchers'
import { createAction } from 'redux-actions'

import type { Dispatch, GetState } from 'redux-first-router/dist/flow-types'
import { clearStoreOnCityChange, clearStoreOnLanguageChange } from '../../endpoint/actions/remover'

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
    const prev = state.location.prev

    if (prev.payload.language && prev.payload.language !== language) {
      clearStoreOnLanguageChange(dispatch, getState)
    }

    if (prev.payload.city && prev.payload.city !== city) {
      clearStoreOnCityChange(dispatch, getState)
    }

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
