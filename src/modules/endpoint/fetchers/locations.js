import { sortBy } from 'lodash/collection'

import LocationModel from '../models/LocationModel'
import { apiUrl } from '../constants'

const urlMapper = () => `${apiUrl}/wp-json/extensions/v1/multisites`

const stripSlashes = path => {
  if (path.startsWith('/')) {
    path = path.substr(1)
  }
  if (path.endsWith('/')) {
    path = path.substr(0, path.length - 1)
  }
  return path
}

const fetcher = (dispatch, location) =>
  fetch(urlMapper())
    .then(response => response.json())
    .then(json => {
      const locations = json
        .map(location => new LocationModel({
          name: location.name,
          code: stripSlashes(location.path),
          live: location.live,
          eventsEnabled: location['ige-evts'] === '1',
          extrasEnabled: true // todo
        })).sort(location => location.name)
      return sortBy(locations, location => location.sortKey)
    })
    .then(locations => {
      dispatch({type: 'LOCATIONS_FETCHED', payload: locations})
      return locations
    }).then(locations => {
      if (location && !locations.find(_location => _location.code === location)) {
        dispatch({type: 'LOCATION_NOT_FOUND', payload: {location}})
      }
    })

export default fetcher
