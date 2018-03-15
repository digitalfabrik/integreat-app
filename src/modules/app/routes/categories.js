// @flow

import { categoriesFetcher, locationLayoutFetcher } from '../../endpoint/fetchers'
import { createAction } from 'redux-actions'

import type { Dispatch, GetState } from 'redux-first-router/dist/flow-types'
import { clearStoreOnCityChange, clearStoreOnLanguageChange } from '../../endpoint/remover'

export const CATEGORIES_ROUTE = 'CATEGORIES'

export const goToCategories = (city: string, language: string, categoryPath: ?string) =>
  createAction(CATEGORIES_ROUTE)({city, language, categoryPath})

export const categoriesRoute = {
  path: '/:city/:language/:categoryPath*',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const {city, language} = state.location.payload
    const prev = state.location.prev

    if (prev.payload.language && prev.payload.language !== language) {
      clearStoreOnLanguageChange(dispatch, getState)
    }

    if (prev.payload.city && prev.payload.city !== city) {
      clearStoreOnCityChange(dispatch, getState)
    }

    await locationLayoutFetcher(dispatch, getState)

    if (!state.categories || prev.payload.city !== city || prev.payload.language !== language) {
      await categoriesFetcher(dispatch, {city, language})
    }
  }
}
