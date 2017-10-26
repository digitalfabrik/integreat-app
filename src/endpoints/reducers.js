import { handleAction } from 'redux-actions'
import reduceReducers from 'reduce-reducers'
import Payload from './Payload'

import LANGUAGE_ENDPOINT from './language'
import LOCATION_ENDPOINT from './location'
import PAGE_ENDPOINT from './page'
import EVENTS_ENDPOINT from './events'
import DISCLAIMER_ENDPOINT from './disclaimer'

/**
 * Contains all reducers from all endpoints which are defined in {@link './endpoints/'}
 */
const reducers = [
  LANGUAGE_ENDPOINT,
  LOCATION_ENDPOINT,
  PAGE_ENDPOINT,
  DISCLAIMER_ENDPOINT,
  EVENTS_ENDPOINT
].reduce((result, endpoint) => {
  let defaultState = new Payload(false)
  let reducer = (state, action) => action.payload

  result[endpoint.name] = reduceReducers(
    handleAction(endpoint.startFetchAction, reducer, defaultState),
    handleAction(endpoint.finishFetchAction, reducer, defaultState)
  )

  return result
}, {})

export default reducers
