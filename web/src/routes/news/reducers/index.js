// @flow

import { Payload, TUNEWS_ENDPOINT_NAME, TunewsModel } from '@integreat-app/integreat-api-client'
import { startFetchActionName } from '../../../modules/app/actions/startFetchAction'
import { finishFetchActionName } from '../../../modules/app/actions/finishFetchAction'
import { type ReduxReducer } from 'redux-actions'
import type { TunewsStateType } from '../../../modules/app/StateType'

type TunewsFetchActionType = { type: string, payload: Payload<Array<TunewsModel>> }

const defaultState = { allData: [], hasMore: true, payload: new Payload(false, null, null, null) }

const fetchTunewsReducer: ReduxReducer<TunewsStateType, TunewsFetchActionType> = (
  state: TunewsStateType = defaultState,
  action: TunewsFetchActionType
) => {
  switch (action.type) {
    case startFetchActionName(TUNEWS_ENDPOINT_NAME):
      return {
        allData: state.allData,
        hasMore: state.hasMore,
        payload: action.payload
      }
    case finishFetchActionName(TUNEWS_ENDPOINT_NAME): {
      const data = action.payload.data
      if (!data) {
        return {
          allData: state.allData,
          hasMore: state.hasMore,
          payload: action.payload
        }
      }
      return {
        allData: [...state.allData, ...data],
        hasMore: data.length !== 0,
        payload: action.payload
      }
    }
    default:
      return state
  }
}

export default fetchTunewsReducer
