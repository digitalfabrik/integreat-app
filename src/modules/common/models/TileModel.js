export default class TileModel {
  constructor ({id, name, path, thumbnail, isExternalUrl = false}) {
    this._id = id
    this._name = name
    this._path = path
    this._thumbnail = thumbnail
    this._isExternalUrl = isExternalUrl
  }

  get id () {
    return this._id
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

  get isExternalUrl () {
    return this._isExternalUrl
  }
}
