// @flow

import languagesEndpoint from '../endpoints/languages'
import citiesEndpoint from '../endpoints/cities'
import categoriesEndpoint from '../endpoints/categories'
import eventsEndpoint from '../endpoints/events'
import disclaimerEndpoint from '../endpoints/disclaimer'
import extrasEndpoint from '../endpoints/extras'
import sprungbrettJobEndpoint from '../endpoints/sprungbrettJobs'
import wohnenEndpoint from '../endpoints/wohnen'
import poisEndpoint from '../endpoints/pois'

import { handleActions } from 'redux-actions'
import Payload from '../Payload'
import { startFetchActionName } from '../actions/startFetchAction'
import { finishFetchActionName } from '../actions/finishFetchAction'
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

export const startFetchReducer = <T> (oldPayload: Payload<T>, action: ActionType<T>): Payload<T> => action.payload
export const finishFetchReducer = <T> (oldPayload: Payload<T>, action: ActionType<T>): Payload<T> => {
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

const reducers: { [actionName: string]: startFetchReducer<*> | finishFetchReducer<*> } = endpoints.reduce(
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
