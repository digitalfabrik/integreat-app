class LanguageModel {
  _code: string
  _name: string

  constructor(code: string, name: string) {
    this._code = code
    this._name = name
  }

  get code(): string {
    return this._code
  }

  get name(): string {
    return this._name
  }
}

export default LanguageModel
