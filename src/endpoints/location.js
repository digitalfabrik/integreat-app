import { groupBy, sortBy } from 'lodash/collection'
import { isEmpty } from 'lodash/lang'
import Endpoint from './endpoint'

export class LocationModel {
  constructor (name, path) {
    this._name = name
    this._path = path
  }

  get name () {
    return this._name
  }

  get path () {
    return this._path
  }

  get category () {
    return isEmpty(this._name) ? '?' : this._name[0].toUpperCase()
  }
}

export default new Endpoint(
  'locations',
  'https://cms.integreat-app.de/wp-json/extensions/v1/multisites',
  json => {
    let locations = json.filter((location) => location.live)
      .map((location) => new LocationModel(location.name, location.path))
    locations = sortBy(locations, location => location.name)
    return groupBy(locations, location => location.category)
  }
)
