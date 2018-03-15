// @flow

import { citiesFetcher } from '../../endpoint/fetchers'
import { createAction } from 'redux-actions'
import i18n from '../i18n'

import type { Dispatch, GetState } from 'redux-first-router/dist/flow-types'
import { goToCategories } from './categories'
import { goToLanding } from './landing'
import { clearStoreOnCityChange } from '../../endpoint/actions/remover'

const MIN_LANGUAGE_CODE_LENGTH = 2
const MAX_LANGUAGE_CODE_LENGTH = 3

export const I18N_REDIRECT_ROUTE = 'I18N_REDIRECT'

export const goToI18nRedirect = (param: ?string) => createAction(I18N_REDIRECT_ROUTE)({param})

export const i18nRedirectRoute = {
  path: '/:param?',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const param = state.location.payload.param
    const prev = state.location.prev

    if (prev.payload.city) {
      clearStoreOnCityChange(dispatch, getState)
    }

    let cities = state.cities
    if (!cities) {
      cities = await citiesFetcher(dispatch, {})
    }

    if (!param) {
      dispatch(goToLanding(i18n.language))
      return
    }

    if (cities.find(_city => _city.code === param)) {
      dispatch(goToCategories(param, i18n.language))
      return
    }

    if (param.length === MIN_LANGUAGE_CODE_LENGTH || param.length === MAX_LANGUAGE_CODE_LENGTH) {
      dispatch(goToLanding(param))
      return
    }

    dispatch({type: 'NOT_FOUND', payload: param})
  }
}
