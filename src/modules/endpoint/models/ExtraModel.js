class ExtraModel {
  constructor ({name, type, url, icon = ''}) {
    this._name = name
    this._type = type
    this._url = url
    this._icon = icon
  }

  get type () {
    return this._type
  }

  get name () {
    return this._name
  }

  get url () {
    return this._url
  }

  get icon () {
    return this._icon
  }
}

export default ExtraModel
