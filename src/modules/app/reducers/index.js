// @flow

import {
  CATEGORIES_ENDPOINT_NAME,
  CITIES_ENDPOINT_NAME,
  DISCLAIMER_ENDPOINT_NAME,
  EVENTS_ENDPOINT_NAME,
  EXTRAS_ENDPOINT_NAME,
  LANGUAGES_ENDPOINT_NAME,
  Payload,
  POIS_ENDPOINT_NAME,
  SPRUNGBRETT_JOBS_ENDPOINT_NAME,
  WOHNEN_ENDPOINT_NAME
} from '@integreat-app/integreat-api-client'
import { handleActions } from 'redux-actions'
import type { StartFetchActionType } from '../../app/actions/startFetchAction'
import { startFetchActionName } from '../../app/actions/startFetchAction'
import type { FinishFetchActionType } from '../../app/actions/finishFetchAction'
import { finishFetchActionName } from '../../app/actions/finishFetchAction'
import type { Reducer } from 'redux'
import type { StateType } from '../StateType'
import type { PayloadDataType } from '../PayloadDataType'

/**
 * Contains all endpoints which are defined in {@link './endpoints/'}
 */
const endpointNames = [
  LANGUAGES_ENDPOINT_NAME,
  CITIES_ENDPOINT_NAME,
  CATEGORIES_ENDPOINT_NAME,
  DISCLAIMER_ENDPOINT_NAME,
  EVENTS_ENDPOINT_NAME,
  EXTRAS_ENDPOINT_NAME,
  SPRUNGBRETT_JOBS_ENDPOINT_NAME,
  WOHNEN_ENDPOINT_NAME,
  POIS_ENDPOINT_NAME
]

export const startFetchReducer = <T: PayloadDataType> (oldPayload?: Payload<T>, action: StartFetchActionType<T>
): Payload<T> => action.payload

export const finishFetchReducer = <T: PayloadDataType> (oldPayload?: Payload<T>, action: FinishFetchActionType<T>
): Payload<T> => {
  if (!oldPayload) {
    return action.payload
  }

  // Only stores the data if the requestUrl hasn't changed since the start of the fetching process.
  // For example the data of "Nürnberg" is very large and could take a while to load, in which time one could change to
  // another city, which data could be overridden then by the data from "Nürnberg"
  if (oldPayload.isFetching && oldPayload.requestUrl === action.payload.requestUrl) {
    return action.payload
  } else {
    return oldPayload
  }
}

const defaultState = new Payload(false)

type ReducerType = Reducer<StateType, StartFetchActionType<PayloadDataType> | FinishFetchActionType<PayloadDataType>>
const reducers: { [actionName: string]: ReducerType } = endpointNames.reduce(
  (result, endpointName) => {
    result[endpointName] = handleActions(
      {
        [startFetchActionName(endpointName)]: startFetchReducer,
        [finishFetchActionName(endpointName)]: finishFetchReducer
      },
      defaultState
    )
    return result
  }, {})

export default reducers
