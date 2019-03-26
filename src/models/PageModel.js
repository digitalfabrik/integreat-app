// @flow

import type Moment from 'moment'

class PageModel {
  _id: number
  _title: string
  _content: string
  _lastUpdate: Moment
  _hash: string

  constructor ({ id, title, content, lastUpdate }: {|
    id: number, title: string, content: string, lastUpdate: Moment, hash: string
  |}) {
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

  get hash (): string {
    return this._hash
  }
}

export default PageModel
