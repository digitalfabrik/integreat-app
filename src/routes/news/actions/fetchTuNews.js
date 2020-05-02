// @flow

import { createTuNewsListEndpoint } from '@integreat-app/integreat-api-client'
import fetchData from '../../../modules/app/fetchData'

const cmsApiBaseUrl = 'https://tunews.integreat-app.de'

// Fetches a list of news items
export const fetchTuNews = (page = 1, count = 20) => (dispatch, getState) => {
  const state = getState()
  const { language } = state.location.payload
  return fetchData(createTuNewsListEndpoint(cmsApiBaseUrl), dispatch, state.tunewsList, { language, page, count })
}

export const resetTuNews = () => {
  return { type: 'RESET_TU_NEWS' }
}
