import languagesEndpoint from '../endpoints/languages'
import citiesEndpoint from '../endpoints/cities'
import categoriesEndpoint from '../endpoints/categories'
import eventsEndpoint from '../endpoints/events'
import disclaimerEndpoint from '../endpoints/disclaimer'
import extrasEndpoint from '../endpoints/extras'
import sprungbrettJobEndpoint from '../endpoints/sprungbrettJobs'
import { handleActions } from 'redux-actions'
import Payload from '../Payload'
import { startFetchActionName } from '../actions/startFetchAction'
import { finishFetchActionName } from '../actions/finishFetchAction'

/**
 * Contains all reducers from all endpoints which are defined in {@link './endpoints/'}
 */
const endpoints = [
  languagesEndpoint,
  citiesEndpoint,
  categoriesEndpoint,
  disclaimerEndpoint,
  eventsEndpoint,
  extrasEndpoint,
  sprungbrettJobEndpoint
]

export const startFetchReducer = (oldPayload, action) => action.payload
export const finishFetchReducer = (oldPayload, action) => {
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

const reducers = endpoints.reduce((result, endpoint) => {
  const name = endpoint.stateName
  result[name] = handleActions({
    [startFetchActionName(name)]: startFetchReducer,
    [finishFetchActionName(name)]: finishFetchReducer
  },
  defaultState
  )
  return result
}, {})

export default reducers
