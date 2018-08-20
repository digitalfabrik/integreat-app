// @flow

import citiesEndpoint from '../../endpoint/endpoints/cities'
import { createAction } from 'redux-actions'

import type { Dispatch, GetState } from 'redux-first-router'

export const I18N_REDIRECT_ROUTE = 'I18N_REDIRECT'

export const goToI18nRedirect = (param: ?string) => createAction(I18N_REDIRECT_ROUTE)({param})

/**
 * I18nRoute to redirect if no language is specified or to the not found route if the param is invalid.
 * Matches / and /param
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
export const i18nRedirectRoute = {
  path: '/:param?',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()

    await citiesEndpoint.loadData(dispatch, state.cities)
  }
}
