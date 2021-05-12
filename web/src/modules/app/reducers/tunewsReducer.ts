// @flow

import { Payload, TUNEWS_ENDPOINT_NAME, TunewsModel } from 'api-client'
import { startFetchActionName } from '../actions/startFetchAction'
import { finishFetchActionName } from '../actions/finishFetchAction'
import { type ReduxReducer } from 'redux-actions'
import type { TunewsStateType } from '../StateType'
import type { StartFetchActionType } from '../actions/startFetchAction'
import type { FinishFetchActionType } from '../actions/finishFetchAction'

type TunewsFetchActionType = StartFetchActionType<{ language: string }> | FinishFetchActionType<Array<TunewsModel>, *>

const defaultState = {
  allData: [],
  language: null,
  hasMore: true,
  payload: new Payload(false, null, null, null)
}

const tunewsReducer: ReduxReducer<TunewsStateType, TunewsFetchActionType> = (
  state: TunewsStateType = defaultState,
  action: TunewsFetchActionType
) => {
  switch (action.type) {
    case startFetchActionName(TUNEWS_ENDPOINT_NAME): {
      const language = action.meta.language
      return {
        language,
        allData: language === state.language ? state.allData : [],
        hasMore: state.hasMore,
        payload: action.payload
      }
    }
    case finishFetchActionName(TUNEWS_ENDPOINT_NAME): {
      const data = action.payload.data
      if (!data) {
        return {
          language: state.language,
          allData: state.allData,
          hasMore: state.hasMore,
          payload: action.payload
        }
      }
      return {
        language: state.language,
        allData: [...state.allData, ...data],
        hasMore: data.length !== 0,
        payload: action.payload
      }
    }
    default:
      return state
  }
}

export default tunewsReducer
