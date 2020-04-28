// @flow

import type Moment from 'moment'

class LocalNewsModel {
  _id: string
  _timestamp: Moment
  _title: string
  _message: string

  constructor (params: {| id: string, timestamp: Moment, title: string, message: string |}) {
    const { id, timestamp, title, message } = params
    this._id = id
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
  
  get id (): string {
    return this._id
  }
}

export default LocalNewsModel
