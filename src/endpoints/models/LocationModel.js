import { isEmpty } from 'lodash/lang'
import { find } from 'lodash/collection'

const IGNORE_PREFIXES = ['stadt', 'kreis', 'landkreis']

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
    this._sortKey = this._name.toLowerCase().trim()
    let prefix = find(IGNORE_PREFIXES, (pre) => this._sortKey.startsWith(pre + ' '))
    this._sortKey = prefix ? this._sortKey.substring(prefix.length).trimStart() : this._sortKey
    this._sortCategory = isEmpty(this._sortKey) ? '?' : this._sortKey[0].toUpperCase()
  }
}
