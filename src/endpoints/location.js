import { sortBy } from 'lodash/collection'

import { endpoint } from './EndpointBuilder'

import LocationModel from './models/LocationModel'

function stripSlashes (path) {
  if (path.startsWith('/')) {
    path = path.substr(1)
  }
  if (path.endsWith('/')) {
    path = path.substr(0, path.length - 1)
  }
  return path
}

export default endpoint('locations')
  .withUrl('https://cms.integreat-app.de/wp-json/extensions/v1/multisites')
  .withMapper(json => {
    const locations = json
      .map((location) => new LocationModel(location.name, stripSlashes(location.path), location.live))
    return sortBy(locations, location => location.sortKey)
  })
  .build()
