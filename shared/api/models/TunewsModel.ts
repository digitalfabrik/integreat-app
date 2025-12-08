import { decodeHTML } from 'entities'
import { DateTime } from 'luxon'

class TunewsModel {
  _id: number
  _title: string
  _tags: string[]
  _lastUpdate: DateTime
  _content: string
  _eNewsNo: string

  constructor(params: {
    id: number
    title: string
    lastUpdate: DateTime
    tags: string[]
    content: string
    eNewsNo: string
  }) {
    const { id, lastUpdate, title, tags, content, eNewsNo } = params
    this._id = id
    this._title = decodeHTML(title)
    this._tags = tags
    this._lastUpdate = lastUpdate
    this._content = content
    this._eNewsNo = eNewsNo
  }

  get id(): number {
    return this._id
  }

  get title(): string {
    return this._title
  }

  get lastUpdate(): DateTime {
    return this._lastUpdate
  }

  get tags(): string[] {
    return this._tags
  }

  get content(): string {
    return this._content
  }

  get eNewsNo(): string {
    return this._eNewsNo
  }
}

export default TunewsModel
