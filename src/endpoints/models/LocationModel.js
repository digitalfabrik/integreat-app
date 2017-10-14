import { isEmpty } from 'lodash/lang'
import { find } from 'lodash/collection'

const IGNORED_PREFIXES = ['stadt', 'kreis', 'landkreis']

export default class LocationModel {
  constructor (name, code, live) {
    this._name = name
    this._code = code
    this._live = live
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
