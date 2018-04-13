export default class ExtraModel {
  constructor ({alias, title, path, thumbnail}) {
    this._alias = alias
    this._title = name
    this._path = path
    this._thumbnail = thumbnail
  }

  get alias () {
    return this._alias
  }

  get thumbnail () {
    return this._thumbnail
  }

  get title () {
    return this._title
  }

  get path () {
    return this._path
  }
}
