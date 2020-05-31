// @flow

import { Payload, TUNEWS_ENDPOINT_NAME, TunewsModel } from '@integreat-app/integreat-api-client'
import { startFetchActionName } from '../../../modules/app/actions/startFetchAction'
import { startFetchMoreActionName } from '../../../modules/app/actions/startFetchMoreAction'
import { finishFetchActionName } from '../../../modules/app/actions/finishFetchAction'
import { finishFetchMoreActionName } from '../../../modules/app/actions/finishFetchMoreAction'
import { type ReduxReducer } from 'redux-actions'

type TuNewsFetchActionType = { type: string, payload: Payload<Array<TunewsModel>> }

const defaultState = new Payload(false, null, null, null)

const fetchTunewsReducer: ReduxReducer<Payload<Array<TunewsModel>>, TuNewsFetchActionType> = (
  state: Payload<Array<TunewsModel>> = defaultState,
  action: TuNewsFetchActionType
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
        requestUrl: state.requestUrl,
        isFetching: state.isFetching,
        isFetchingFirstTime: false
      }
    case finishFetchMoreActionName(TUNEWS_ENDPOINT_NAME): {
      return {
        data: [...state.data, ...action.payload.data],
        requestUrl: state.requestUrl,
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
