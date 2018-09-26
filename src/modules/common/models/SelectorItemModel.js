// @flow
export default class SelectorItemModel {
  _code: string
  _name: string
  _onPress: () => void

  constructor (params: { code: string, name: string, onPress: () => void }) {
    this._code = params.code
    this._name = params.name
    this._onPress = params.onPress
  }

  get code (): string {
    return this._code
  }

  get name (): string {
    return this._name
  }

  get onPress (): () => void {
    return this._onPress
  }
}
