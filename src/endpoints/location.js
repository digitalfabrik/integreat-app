import { groupBy, sortBy } from 'lodash/collection'
import { isEmpty } from 'lodash/lang'
import Endpoint from './endpoint'

export class LocationModel {
  constructor (name, path) {
    this._code = name
    this._name = path
  }

  get name () {
    return this._code
  }

  get path () {
    return this._name
  }

  get category () {
    return isEmpty(this._code) ? '?' : this._code[0].toUpperCase()
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
