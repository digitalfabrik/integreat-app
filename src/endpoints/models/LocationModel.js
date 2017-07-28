import { isEmpty } from 'lodash/lang'
import { find } from 'lodash/collection'

const IGNORE_PREFIXES = ['stadt', 'kreis', 'landkreis']

export default class LocationModel {
  constructor (name, path, live) {
    this._code = name
    this._name = path
    this._live = live
    this.setCategory()
  }

  get live () {
    return this._live
  }

  get name () {
    return this._code
  }

  get path () {
    return this._name
  }

  get category () {
    return this._category
  }

  setCategory () {
    let key = this._code.toLowerCase().trim()
    let prefix = find(IGNORE_PREFIXES, (pre) => key.startsWith(pre + ' '))
    key = prefix ? key.substring(prefix.length).trimStart() : key
    this._category = isEmpty(key) ? '?' : key[0].toUpperCase()
  }
}
