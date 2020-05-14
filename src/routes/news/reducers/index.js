// @flow

import { Payload, TunewsModel, TUNEWS_ENDPOINT_NAME } from '@integreat-app/integreat-api-client'
import type { PayloadDataType } from '../../../modules/app/PayloadDataType'
import { startFetchActionName } from '../../../modules/app/actions/startFetchAction'
import { startFetchMoreActionName } from '../../../modules/app/actions/startFetchMoreAction'
import { finishFetchActionName } from '../../../modules/app/actions/finishFetchAction'
import { finishFetchMoreActionName } from '../../../modules/app/actions/finishFetchMoreAction'

type TuNewsFetchActionType<T: PayloadDataType> = { type: string, payload: Payload<T> }

const defaultState = new Payload(false, false, [])

const fetchTunewsReducer = (
  state: Payload<Array<TunewsModel>> = defaultState,
  action: TuNewsFetchActionType<TunewsModel>
) => {
  switch (action.type) {
    case startFetchActionName(TUNEWS_ENDPOINT_NAME):
      return {
        data: [],
        requestUrl: action.payload.requestUrl,
        isFetching: state.isFetching,
        isFetchingFirstTime: true
      }
    case finishFetchActionName(TUNEWS_ENDPOINT_NAME):
      return {
        data: [...action.payload.data],
        requestUrl: action.payload.requestUrl,
        isFetching: state.isFetching,
        hasMore: action.payload.data.length !== 0,
        isFetchingFirstTime: false
      }
    case startFetchMoreActionName(TUNEWS_ENDPOINT_NAME):
      return {
        data: [...state.data],
        requestUrl: action.payload.requestUrl,
        isFetching: state.isFetching,
        isFetchingFirstTime: false
      }
    case finishFetchMoreActionName(TUNEWS_ENDPOINT_NAME): {
      return {
        data: [...state.data, ...action.payload.data],
        requestUrl: action.payload.requestUrl,
        isFetching: state.isFetching,
        hasMore: action.payload.data.length !== 0,
        isFetchingFirstTime: false
      }
    }
    default:
      return state
  }
}

export default fetchTunewsReducer
