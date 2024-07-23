import { decodeHTML } from 'entities'
import { DateTime } from 'luxon'

class LocalNewsModel {
  _id: number
  _timestamp: DateTime
  _title: string
  _content: string
  _availableLanguages: Record<string, number>

  constructor(params: {
    id: number
    timestamp: DateTime
    title: string
    content: string
    availableLanguages: Record<string, { id: number }>
  }) {
    const { id, timestamp, title, content, availableLanguages } = params
    this._id = id
    this._timestamp = timestamp
    this._title = decodeHTML(title)
    this._content = decodeHTML(content)
    this._availableLanguages = Object.entries(availableLanguages).reduce(
      (acc, [code, value]) => ({ ...acc, [code]: value.id }),
      {},
    )
  }

  get availableLanguages(): Record<string, number> {
    return this._availableLanguages
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
