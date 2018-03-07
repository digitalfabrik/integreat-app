export default class ExtraModel {
  constructor ({alias, name, path, thumbnail}) {
    this._alias = alias
    this._name = name
    this._path = path
    this._thumbnail = thumbnail
  }

  get alias () {
    return this._alias
  }

  get thumbnail () {
    return this._thumbnail
  }

  get name () {
    return this._name
  }

  get path () {
    return this._path
  }
}
