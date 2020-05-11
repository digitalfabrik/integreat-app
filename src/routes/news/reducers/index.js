// @flow

import { Payload, TunewsModel, TUNEWS_ENDPOINT_NAME } from '@integreat-app/integreat-api-client'
import type { PayloadDataType } from '../../../modules/app/PayloadDataType'
import { START_FETCH_TUNEWS, FINISH_FETCH_TUNEWS, RESET_TUNEWS } from '../actions/fetchMoreTunews'
import { startFetchMoreActionName } from '../actions/startFetchMoreAction'
import { finishFetchMoreActionName } from '../actions/finishFetchMoreAction'

type TuNewsFetchActionType<T: PayloadDataType> = { type: string, payload: Payload<T> }

const defaultState = new Payload(false, false, [])

const fetchTunewsReducer = (
  state: Payload<Array<TunewsModel>> = defaultState,
  action: TuNewsFetchActionType<TunewsModel>
) => {
  switch (action.type) {
    case START_FETCH_TUNEWS:
      return {
        data: [],
        requestUrl: action.payload.requestUrl,
        isFetching: state.isFetching,
        isFetchingFirstTime: true
      }
    case FINISH_FETCH_TUNEWS:
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
    case RESET_TUNEWS: {
      return {
        data: [],
        hasMore: true,
        requestUrl: false,
        isFetching: false,
        isFetchingFirstTime: false
      }
    }
    default:
      return state
  }
}

export default fetchTunewsReducer
