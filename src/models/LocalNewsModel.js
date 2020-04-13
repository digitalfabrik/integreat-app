// @flow

import type Moment from 'moment'

class LocalNewsModel {
  _timestamp: Moment
  _title: string
  _message: string

  constructor (params: {| timestamp: Moment, title: string, message: string |}) {
    const { timestamp, title, message } = params
    this._timestamp = timestamp
    this._title = title
    this._message = message
  }

  get timestamp (): Moment {
    return this._timestamp
  }

  get title (): string {
    return this._title
  }

  get message (): string {
    return this._message
  }
}

export default LocalNewsModel
