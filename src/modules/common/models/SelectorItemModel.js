export default class SelectorItemModel {
  constructor ({code, name, href}) {
    this._code = code
    this._name = name
    this._href = href
  }

  get code () {
    return this._code
  }

  get name () {
    return this._name
  }

  get href () {
    return this._href
  }
}
