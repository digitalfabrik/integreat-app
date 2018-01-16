class ExtraModel {
  constructor ({name, type, url}) {
    this._name = name
    this._type = type
    this._url = url
  }

  get name () {
    return this._name
  }

  get type () {
    return this._type
  }

  get url () {
    return this._url
  }
}

export default ExtraModel
