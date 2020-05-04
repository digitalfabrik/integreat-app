// @flow

import { createTuNewsEndpoint } from '@integreat-app/integreat-api-client'
import fetchData from '../../../modules/app/fetchData'
import { tuNewsApiBaseUrl } from '../../../modules/app/constants/urls'

const DEFAULT_LIMIT = 20
const DEFAULT_PAGE_NUMBER = 1

export const fetchTuNews = (page = DEFAULT_PAGE_NUMBER, count = DEFAULT_LIMIT) => (dispatch, getState) => {
  const state = getState()
  const { language } = state.location.payload
  return fetchData(createTuNewsEndpoint(tuNewsApiBaseUrl), dispatch, state.tunewsList, { language, page, count })
}

export const resetTuNews = () => {
  return { type: 'RESET_TU_NEWS' }
}
