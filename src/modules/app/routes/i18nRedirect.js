// @flow

import citiesFetcher from '../../endpoint/endpoints/cities'
import { createAction } from 'redux-actions'
import i18n from '../i18n'
import { redirect } from 'redux-first-router'

import type { Dispatch, GetState } from 'redux-first-router/dist/flow-types'
import { goToCategories } from './categories'
import { goToLanding } from './landing'
import { goToNotFound } from './notFound'
import { MAX_LANGUAGE_CODE_LENGTH, MIN_LANGUAGE_CODE_LENGTH } from '../constants'

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
    const param = state.location.payload.param

    const citiesPayload = await citiesFetcher.fetchData(dispatch, state.cities)

    if (!citiesPayload.data) {
      // todo error handling
    }

    // the param does not exist (or is 'landing'), so redirect to the landing page with the detected language
    if (!param || param === 'landing') {
      dispatch(redirect(goToLanding(i18n.language)))
      return
    }

    // the param is a valid city, so redirect to the categories route with the detected language
    if (citiesPayload.data.find(_city => _city.code === param)) {
      dispatch(redirect(goToCategories(param, i18n.language)))
      return
    }

    // the param is probably a language code, so redirect to the landing route
    if (param.length >= MIN_LANGUAGE_CODE_LENGTH || param.length <= MAX_LANGUAGE_CODE_LENGTH) {
      dispatch(redirect(goToLanding(param)))
      return
    }

    // param is neither a language code nor a city, so it is not a valid route
    dispatch(redirect(goToNotFound(param)))
  }
}
