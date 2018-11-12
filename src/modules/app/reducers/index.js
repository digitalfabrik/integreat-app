// @flow

import languagesEndpoint from '../../endpoint/endpoints/languages'
import citiesEndpoint from '../../endpoint/endpoints/cities'
import categoriesEndpoint from '../../endpoint/endpoints/categories'
import eventsEndpoint from '../../endpoint/endpoints/events'
import disclaimerEndpoint from '../../endpoint/endpoints/disclaimer'
import extrasEndpoint from '../../endpoint/endpoints/extras'
import sprungbrettJobEndpoint from '../../endpoint/endpoints/sprungbrettJobs'
import wohnenEndpoint from '../../endpoint/endpoints/wohnen'
import poisEndpoint from '../../endpoint/endpoints/pois'

import { handleActions } from 'redux-actions'
import Payload from '../../endpoint/Payload'
import { startFetchActionName } from '../../app/actions/startFetchAction'
import { finishFetchActionName } from '../../app/actions/finishFetchAction'
import type { ActionType } from '../../app/createReduxStore'

/**
 * Contains all endpoints which are defined in {@link './endpoints/'}
 */
const endpoints = [
  languagesEndpoint,
  citiesEndpoint,
  categoriesEndpoint,
  disclaimerEndpoint,
  eventsEndpoint,
  extrasEndpoint,
  sprungbrettJobEndpoint,
  wohnenEndpoint,
  poisEndpoint
]

// fixme: WEBAPP-400 This type should be removed
export type ReducerType<T> = <T> (oldPayload?: Payload<T>, action: ActionType<T>) => Payload<T>

export const startFetchReducer: ReducerType<*> = <T> (oldPayload?: Payload<T>, action: ActionType<T>): Payload<T> =>
  action.payload

export const finishFetchReducer: ReducerType<*> = <T> (oldPayload?: Payload<T>, action: ActionType<T>): Payload<T> => {
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

const reducers: { [actionName: string]: ReducerType<*> } = endpoints.reduce(
  (result, endpoint) => {
    const name = endpoint.stateName
    result[name] = handleActions(
      {
        [startFetchActionName(name)]: startFetchReducer,
        [finishFetchActionName(name)]: finishFetchReducer
      },
      defaultState
    )
    return result
  }, {})

export default reducers
