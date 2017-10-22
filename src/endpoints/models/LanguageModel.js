class LanguageModel {
  constructor (code, name) {
    this._name = code
    this._code = name
  }

  get code () {
    return this._name
  }

  get name () {
    return this._code
  }
}

export default LanguageModel
