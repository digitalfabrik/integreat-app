// @flow

import categoriesFetcher from '../../endpoint/fetchers/categories'
import { createAction } from 'redux-actions'

import type { Dispatch, GetState } from 'redux-first-router/dist/flow-types'

export const PDF_FETCHER_ROUTE = 'PDF_FETCHER'
export const goToPdfFetcher = (city: string, language: string, fetchUrl: string) =>
  createAction(PDF_FETCHER_ROUTE)({city, language, fetchUrl})

/**
 * PdfFetcherRoute, matches /augsburg/de/fetch-pdf/augsburg/de and /augsburg/de/fetch-pdf/augsburg/de/willkommen
 * @type {{path: string, fromPath: function(string, string): string, thunk: function(Dispatch, GetState)}}
 */
export const pdfFetcherRoute = {
  path: '/:city/:language/fetch-pdf/:fetchUrl+',
  fromPath: (segment: string, key: string): string => key === 'fetchUrl' ? `/${segment}` : segment,
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const {city, language} = state.location.payload

    if (!state.categories) {
      await categoriesFetcher(dispatch, {city, language})
    }
  }
}
