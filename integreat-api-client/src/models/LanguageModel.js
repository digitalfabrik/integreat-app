// @flow

import type { LanguageDirectionType } from '../types'

class LanguageModel {
  _code: string
  _name: string
  _direction: ?LanguageDirectionType

  constructor (code: string, name: string, direction?: LanguageDirectionType) {
    this._code = code
    this._name = name
    this._direction = direction
  }

  get code (): string {
    return this._code
  }

  get name (): string {
    return this._name
  }

  get direction (): ?LanguageDirectionType {
    return this._direction
  }
}

export default LanguageModel
