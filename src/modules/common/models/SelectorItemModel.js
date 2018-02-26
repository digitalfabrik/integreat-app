export default class SelectorItemModel {
  constructor ({code, name, path}) {
    this._code = code
    this._name = name
    this._path = path
  }

  get code () {
    return this._code
  }

  get name () {
    return this._name
  }

  get path () {
    return this._path
  }
}
