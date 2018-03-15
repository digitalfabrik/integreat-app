// @flow

import { categoriesFetcher, locationLayoutFetcher } from '../../endpoint/fetchers'
import { createAction } from 'redux-actions'

import type { Dispatch, GetState } from 'redux-first-router/dist/flow-types'
import { clearStoreOnCityChange, clearStoreOnLanguageChange } from '../../endpoint/actions/remover'

export const PDF_FETCHER_ROUTE = 'PDF_FETCHER'
export const goToPdfFetcher = (city: string, language: string, fetchUrl: string) =>
  createAction(PDF_FETCHER_ROUTE)({city, language, fetchUrl})

export const pdfFetcherRoute = {
  path: '/:city/:language/fetch-pdf/:fetchUrl+',
  fromPath: (segment: string, key: string): string => key === 'fetchUrl' ? `/${segment}` : segment,
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
