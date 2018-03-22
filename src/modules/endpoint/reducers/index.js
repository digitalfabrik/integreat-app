import languagesEndpoint from '../endpoints/languages'
import citiesEndpoint from '../endpoints/cities'
import categoriesEndpoint from '../endpoints/categories'
import eventsEndpoint from '../endpoints/events'
import disclaimerEndpoint from '../endpoints/disclaimer'
import extrasEndpoint from '../endpoints/extras'
import sprungbrettJobEndpoint from '../endpoints/sprungbrettJobs'
import { handleActions } from 'redux-actions'
import { finishFetchActionName, startFetchActionName } from '../Endpoint'
import Payload from '../Payload'

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
