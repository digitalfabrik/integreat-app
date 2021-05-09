export default class SelectorItemModel {
  _code: string
  _name: string
  _enabled: boolean
  _onPress: () => void

  constructor(params: { code: string; name: string; enabled: boolean; onPress: () => void }) {
    this._code = params.code
    this._name = params.name
    this._enabled = params.enabled
    this._onPress = params.onPress
  }

  get code(): string {
    return this._code
  }

  get name(): string {
    return this._name
  }

  get enabled(): boolean {
    return this._enabled
  }

  get onPress(): () => void {
    return this._onPress
  }
}
