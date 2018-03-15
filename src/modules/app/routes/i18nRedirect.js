import { citiesFetcher } from '../../endpoint/fetchers'
import i18n from '../i18n'

const MIN_LANGUAGE_CODE_LENGTH = 2
const MAX_LANGUAGE_CODE_LENGTH = 3

const route = {
  path: '/:param?',
  thunk: async (dispatch, getState) => {
    const state = getState()
    const param = state.location.payload.param

    let cities = state.cities
    if (!cities) {
      cities = await citiesFetcher(dispatch, {})
    }

    if (!param) {
      dispatch({type: 'LANDING', payload: {language: i18n.language}})
    }

    if (cities.find(_city => _city.code === param)) {
      dispatch({type: 'CATEGORIES', payload: {city: param, language: i18n.language}})
    }

    if (param.length === MIN_LANGUAGE_CODE_LENGTH || param.length === MAX_LANGUAGE_CODE_LENGTH) {
      dispatch({type: 'LANDING', payload: {language: param}})
    }

    dispatch({type: 'NOT_FOUND', payload: param})
  }
}

export default route
