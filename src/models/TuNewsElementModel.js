// @flow

import type Moment from 'moment'

class TuNewsElementModel {
  _id: number
  _title: string
  _tags: string[]
  _date: Moment
  _content: string
  _enewsno: string
  constructor (params: {| id: number, title: string,
    date: Moment, tags: string[], content: string, enewsno: string |}) {
    const { id, date, title, content, tags, enewsno } = params
    this._id = id
    this._title = title
    this._tags = tags
    this._date = date
    this._content = content
    this._enewsno = enewsno
  }

  get id (): number {
    return this._id
  }

  get title (): string {
    return this._title
  }

  get date (): Moment {
    return this._date
  }

  get tags (): string[] {
    return this._tags
  }

  get content (): ?string {
    return this._content
  }

  get enewsno (): ?string {
    return this._enewsno
  }
}

export default TuNewsElementModel
