import { decodeHTML } from 'entities'
import { DateTime } from 'luxon'

class LocalNewsModel {
  _id: number
  _timestamp: DateTime
  _title: string
  _content: string

  constructor(params: { id: number; timestamp: DateTime; title: string; content: string }) {
    const { id, timestamp, title, content } = params
    this._id = id
    this._timestamp = timestamp
    this._title = decodeHTML(title)
    this._content = decodeHTML(content)
  }

  get timestamp(): DateTime {
    return this._timestamp
  }

  get title(): string {
    return this._title
  }

  get content(): string {
    return this._content
  }

  get id(): number {
    return this._id
  }
}

export default LocalNewsModel
