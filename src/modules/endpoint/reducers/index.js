import langaugeEndpoint from '../endpoints/languages'
import locationEndpoint from '../endpoints/location'
import categoriesEndpoint from '../endpoints/categories'
import eventsEndpoint from '../endpoints/events'
import disclaimerEndpoint from '../endpoints/disclaimer'

/**
 * Contains all reducers from all endpoints which are defined in {@link './endpoints/'}
 */
const endpoints = [
  langaugeEndpoint,
  locationEndpoint,
  categoriesEndpoint,
  disclaimerEndpoint,
  eventsEndpoint
]
const reducers = endpoints.reduce((result, endpoint) => {
  result[endpoint.stateName] = endpoint.createReducer()
  return result
}, {})

export default reducers
