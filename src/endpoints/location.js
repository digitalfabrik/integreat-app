import { groupBy, sortBy } from 'lodash/collection'
import Endpoint from './Endpoint'
import LocationModel from './models/LocationModel'

export default new Endpoint(
  'locations',
  'https://cms.integreat-app.de/wp-json/extensions/v1/multisites',
  json => {
    if (!json) {
      return {}
    }
    let locations = json
      .map((location) => new LocationModel(location.name, location.path, location.live))
    locations = sortBy(locations, location => location.name)
    return groupBy(locations, location => location.category)
  }
)
