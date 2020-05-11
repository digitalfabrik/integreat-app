// @flow

import { createTunewsEndpoint, TUNEWS_ENDPOINT_NAME } from '@integreat-app/integreat-api-client'
import type { Dispatch } from 'redux'
import fetchMoreData from '../fetchMoreData'
import { tunewsApiBaseUrl } from '../../../modules/app/constants/urls'
import type { StateType } from '../../../modules/app/StateType'
import type { StoreActionType } from '../../../modules/app/StoreActionType'

const TUNEWS_ITEMS_PER_PAGE = 20
const DEFAULT_PAGE_NUMBER = 1

export const START_FETCH_TUNEWS = `START_FETCH_${TUNEWS_ENDPOINT_NAME.toUpperCase()}`
export const FINISH_FETCH_TUNEWS = `FINISH_FETCH_${TUNEWS_ENDPOINT_NAME.toUpperCase()}`

export const fetchMoreTunews = (
  page: number = DEFAULT_PAGE_NUMBER,
  count: number = TUNEWS_ITEMS_PER_PAGE
) => (dispatch: Dispatch<StoreActionType>, getState: () => StateType) => {
  const state = getState()
  const { language } = state.location.payload
  return fetchMoreData(createTunewsEndpoint(tunewsApiBaseUrl), dispatch, state.tunews, { language, page, count })
}
