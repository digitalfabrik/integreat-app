import { decodeHTML } from 'entities'
import { Moment } from 'moment'

class LocalNewsModel {
  _id: number
  _timestamp: Moment
  _title: string
  _content: string

  constructor(params: { id: number; timestamp: Moment; title: string; content: string }) {
    const { id, timestamp, title, content } = params
    this._id = id
    this._timestamp = timestamp
    this._title = decodeHTML(title)
    this._content = decodeHTML(content)
  }

  get timestamp(): Moment {
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
