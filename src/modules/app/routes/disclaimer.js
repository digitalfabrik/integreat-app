// @flow

import disclaimerEndpoint from '../../endpoint/endpoints/disclaimer'
import { createAction } from 'redux-actions'

import type { Dispatch, GetState, Route } from 'redux-first-router'
import fetchData from '../fetchData'

export const DISCLAIMER_ROUTE: string = 'DISCLAIMER'

export const goToDisclaimer = (city: string, language: string) =>
  createAction<string, { city: string, language: string }>(DISCLAIMER_ROUTE)({
    city,
    language
  })

export const getDisclaimerPath = (city: string, language: string): string => `/${city}/${language}/disclaimer`

/**
 * DisclaimerRoute (for city specific disclaimers), matches /augsburg/de/disclaimer
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
export const disclaimerRoute: Route = {
  path: '/:city/:language/disclaimer',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const {city, language} = state.location.payload

    await fetchData(disclaimerEndpoint, dispatch, state.disclaimer, {city, language})
  }
}
