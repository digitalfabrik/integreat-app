// @flow

import citiesEndpoint from '../../endpoint/endpoints/cities'
import type { Dispatch, GetState, Route } from 'redux-first-router'
import fetchData from '../fetchData'

export type I18nRedirectRouteParamsType = {|param?: string|}

export const I18N_REDIRECT_ROUTE = 'I18N_REDIRECT'

export const getI18nRedirectPath = ({param}: I18nRedirectRouteParamsType): string => `/${param || ''}`

/**
 * I18nRoute to redirect if no language is specified or to the not found route if the param is invalid.
 * Matches / and /param
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
const i18nRedirectRoute: Route = {
  path: '/:param?',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()

    await fetchData(citiesEndpoint, dispatch, state.cities)
  }
}

export default i18nRedirectRoute
