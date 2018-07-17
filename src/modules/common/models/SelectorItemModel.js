// @flow
export default class SelectorItemModel {
  _code: string
  _name: string
  _href: string

  constructor (params: { code: string, name: string, href: string }) {
    this._code = params.code
    this._name = params.name
    this._href = params.href
  }

  get code (): string {
    return this._code
  }

  get name (): string {
    return this._name
  }

  get href (): string {
    return this._href
  }
}
