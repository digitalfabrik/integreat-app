// @flow

import { createTunewsEndpoint, TUNEWS_ENDPOINT_NAME } from '@integreat-app/integreat-api-client'
import type { Dispatch } from 'redux'
import fetchData from '../../../modules/app/fetchData'
import { tunewsApiBaseUrl } from '../../../modules/app/constants/urls'
import type { StateType } from '../../../modules/app/StateType'
import type { StoreActionType } from '../../../modules/app/StoreActionType'

const DEFAULT_LIMIT = 20
const DEFAULT_PAGE_NUMBER = 1

export const RESET_TUNEWS = 'RESET_TUNEWS'
export const START_FETCH_TUNEWS = `START_FETCH_${TUNEWS_ENDPOINT_NAME.toUpperCase()}`
export const FINISH_FETCH_TUNEWS = `FINISH_FETCH_${TUNEWS_ENDPOINT_NAME.toUpperCase()}`

export const fetchTunews = (
  page: number = DEFAULT_PAGE_NUMBER,
  count: number = DEFAULT_LIMIT
) => (dispatch: Dispatch<StoreActionType>, getState: () => StateType) => {
  const state = getState()
  const { language } = state.location.payload
  return fetchData(createTunewsEndpoint(tunewsApiBaseUrl), dispatch, state.tunews, { language, page, count })
}

export const resetTunews = () => {
  return { type: RESET_TUNEWS }
}
