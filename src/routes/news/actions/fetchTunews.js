// @flow

import { createTunewsEndpoint } from '@integreat-app/integreat-api-client'
import type { Dispatch } from 'redux'
import { tunewsApiBaseUrl } from '../../../modules/app/constants/urls'
import type { StateType } from '../../../modules/app/StateType'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import fetchData from '../../../modules/app/fetchData'

const TUNEWS_ITEMS_PER_PAGE = 20
const DEFAULT_PAGE_NUMBER = 1

export const fetchTunews = (
  page: number = DEFAULT_PAGE_NUMBER,
  count: number = TUNEWS_ITEMS_PER_PAGE
) => (dispatch: Dispatch<StoreActionType>, getState: () => StateType) => {
  const state: StateType = getState()
  const { language } = state.location.payload
  return fetchData<*, *>(
    createTunewsEndpoint(tunewsApiBaseUrl), dispatch, state.tunews.payload, { language, page, count })
}
