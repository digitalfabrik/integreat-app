import { isEmpty } from 'lodash/lang'
import { find } from 'lodash/collection'

const IGNORED_PREFIXES = ['stadt', 'kreis', 'landkreis']

class LocationModel {
  constructor ({name, code, live = false, eventsEnabled = false, extrasEnabled = false}) {
    const {sortKey, sortCategory} = LocationModel.getSortingInformation(name)

    this._name = name
    this._code = code
    this._live = live
    this._eventsEnabled = eventsEnabled
    this._extrasEnabled = extrasEnabled
    this._sortKey = sortKey
    this._sortCategory = sortCategory
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

  static getSortingInformation (name) {
    name = name.toLowerCase()
    const prefix = find(IGNORED_PREFIXES, (pre) => name.startsWith(pre + ' '))

    if (prefix) {
      name = name.substring(prefix.length + 1).trim()
    }

    return {
      sortKey: name,
      sortCategory: isEmpty(name) ? '?' : name[0].toUpperCase()
    }
  }
}

export default LocationModel
