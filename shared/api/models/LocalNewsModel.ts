/* eslint-disable camelcase */

/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { decodeHTML } from 'entities'
import { DateTime } from 'luxon'

class LocalNewsModel {
  _id: number
  _timestamp: DateTime
  _display_date: DateTime
  _title: string
  _content: string
  _availableLanguages: Record<string, number>

  constructor(params: {
    id: number
    timestamp: DateTime
    display_date: DateTime
    title: string
    content: string
    availableLanguages: Record<string, number>
  }) {
    const { id, timestamp, display_date, title, content, availableLanguages } = params
    this._id = id
    this._timestamp = timestamp
    this._display_date = display_date
    this._title = decodeHTML(title)
    this._content = decodeHTML(content)
    this._availableLanguages = availableLanguages
  }

  get availableLanguages(): Record<string, number> {
    return this._availableLanguages
  }

  get timestamp(): DateTime {
    return this._timestamp
  }

  get display_date(): DateTime {
    return this._display_date
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
