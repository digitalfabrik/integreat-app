import { isEmpty } from 'lodash/lang'

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
    let key = this._code.toLowerCase()
    for (let i = 0; i < IGNORE_PREFIXES.length; i++) {
      if (key.startsWith(IGNORE_PREFIXES[i] + ' ')) {
        key = key.substring(IGNORE_PREFIXES[i].length + 1)
        break
      }
    }
    this._category = isEmpty(key) ? '?' : key[0].toUpperCase()
  }
}
