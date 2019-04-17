// @flow
export default class SelectorItemModel {
  _code: string
  _name: string
  _active: boolean
  _onPress: () => void

  constructor (params: { code: string, name: string, active: boolean, onPress: () => void }) {
    this._code = params.code
    this._name = params.name
    this._active = params.active
    this._onPress = params.onPress
  }

  get code (): string {
    return this._code
  }

  get name (): string {
    return this._name
  }

  get active (): boolean {
    return this._active
  }

  get onPress (): () => void {
    return this._onPress
  }
}
