// @flow

import type Moment from 'moment'

class LocalNewsModel {
  _timestap: Moment
  _title: string
  _message: string

  constructor (params: {| timestap: Moment, title: string, message: string |}) {
    const { timestap, title, message } = params
    this._timestap = timestap
    this._title = title
    this._message = message
  }

  get timestap (): Moment {
    return this._timestap
  }

  get title (): string {
    return this._title
  }

  get message (): string {
    return this._message
  }
}

export default LocalNewsModel
