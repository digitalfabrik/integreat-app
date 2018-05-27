// @flow

import type { Moment } from 'moment'

class DisclaimerModel {
  _id: number
  _title: string
  _content: string
  _lastUpdate: Moment

  constructor ({id, title, content, lastUpdate}: {|id: number, title: string, content: string, lastUpdate: Moment|}) {
    this._id = id
    this._title = title
    this._content = content
    this._lastUpdate = lastUpdate
  }

  get id (): number {
    return this._id
  }

  get title (): string {
    return this._title
  }

  get content (): string {
    return this._content
  }

  get lastUpdate (): Moment {
    return this._lastUpdate
  }
}

export default DisclaimerModel
