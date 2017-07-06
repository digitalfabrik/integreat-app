import { isEmpty } from 'lodash/lang'

export default class LocationModel {
  constructor (name, path, live) {
    this._code = name
    this._name = path
    this._live = live
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
    return isEmpty(this._code) ? '?' : this._code[0].toUpperCase()
  }
}
