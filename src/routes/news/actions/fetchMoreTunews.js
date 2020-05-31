// @flow

import { createTunewsEndpoint } from '@integreat-app/integreat-api-client'
import type { Dispatch } from 'redux'
import fetchMoreData from '../../../modules/app/fetchMoreData'
import { tunewsApiBaseUrl } from '../../../modules/app/constants/urls'
import type { StateType } from '../../../modules/app/StateType'
import type { StoreActionType } from '../../../modules/app/StoreActionType'

const TUNEWS_ITEMS_PER_PAGE = 20
const DEFAULT_PAGE_NUMBER = 1

export const fetchMoreTunews = (
  page: number = DEFAULT_PAGE_NUMBER,
  count: number = TUNEWS_ITEMS_PER_PAGE
) => (dispatch: Dispatch<StoreActionType>, getState: () => StateType) => {
  const state = getState()
  const { language } = state.location.payload
  return fetchMoreData<*, *>(createTunewsEndpoint(tunewsApiBaseUrl), dispatch, state.tunews, { language, page, count })
}
