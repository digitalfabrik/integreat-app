import languagesEndpoint from '../endpoints/languages'
import locationEndpoint from '../endpoints/locations'
import categoriesEndpoint from '../endpoints/categories'
import eventsEndpoint from '../endpoints/events'
import disclaimerEndpoint from '../endpoints/disclaimer'
import extrasEndpoint from '../endpoints/extras'
import jobEndpoint from '../endpoints/jobs'

/**
 * Contains all reducers from all endpoints which are defined in {@link './endpoints/'}
 */
const endpoints = [
  languagesEndpoint,
  locationEndpoint,
  categoriesEndpoint,
  disclaimerEndpoint,
  eventsEndpoint,
  extrasEndpoint,
  jobEndpoint
]
const reducers = endpoints.reduce((result, endpoint) => {
  result[endpoint.stateName] = endpoint.createReducer()
  return result
}, {})

export default reducers
