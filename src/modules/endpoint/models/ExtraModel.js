export default class ExtraModel {
  constructor ({type, name, path, thumbnail}) {
    this._type = type
    this._name = name
    this._path = path
    this._thumbnail = thumbnail
  }

  get type () {
    return this._type
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
