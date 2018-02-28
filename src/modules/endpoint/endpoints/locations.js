import { sortBy } from 'lodash/collection'

import EndpointBuilder from '../EndpointBuilder'

import LocationModel from '../models/LocationModel'

function stripSlashes (path) {
  if (path.startsWith('/')) {
    path = path.substr(1)
  }
  if (path.endsWith('/')) {
    path = path.substr(0, path.length - 1)
  }
  return path
}

export default new EndpointBuilder('locations')
  .withStateToUrlMapper(() => 'https://cms.integreat-app.de/wp-json/extensions/v1/multisites')
  .withMapper(json => {
    const locations = json
      .map(location => new LocationModel({
        name: location.name,
        code: stripSlashes(location.path),
        live: location.live,
        eventsEnabled: location['ige-evts'] === '1',
        extrasEnabled: true // todo
      }))
    return sortBy(locations, location => location.sortKey)
  })
  .build()
