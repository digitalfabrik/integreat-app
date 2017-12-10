import { isEmpty } from 'lodash/lang'
import { find } from 'lodash/collection'

const IGNORED_PREFIXES = ['stadt', 'kreis', 'landkreis']

class LocationModel {
  constructor ({name, code, live, eventsEnabled, extrasEnabled}) {
    this._name = name
    this._code = code
    this._live = live
    this._eventsEnabled = eventsEnabled
    this._extrasEnabled = extrasEnabled
    this.initializeSorting()
  }

  get live () {
    return this._live
  }

  get name () {
    return this._name
  }

  get code () {
    return this._code
  }

  get sortKey () {
    return this._sortKey
  }

  get sortCategory () {
    return this._sortCategory
  }

  get eventsEnabled () {
    return this._eventsEnabled
  }

  get extrasEnabled () {
    return this._extrasEnabled
  }

  initializeSorting () {
    let name = this._name.toLowerCase()
    const prefix = find(IGNORED_PREFIXES, (pre) => name.startsWith(pre + ' '))

    if (prefix) {
      name = name.substring(prefix.length + 1).trim()
    }

    this._sortKey = name
    this._sortCategory = isEmpty(name) ? '?' : name[0].toUpperCase()
  }
}

export default LocationModel
