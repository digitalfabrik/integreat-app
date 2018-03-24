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

const reducer = (state, action) => action.payload
const defaultState = new Payload(false)

const reducers = endpoints.reduce((result, endpoint) => {
  const name = endpoint.stateName
  result[name] = handleActions({
    [startFetchActionName(name)]: reducer,
    [finishFetchActionName(name)]: reducer
  },
  defaultState
  )
  return result
}, {})

export default reducers
