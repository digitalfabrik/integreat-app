import { decodeHTML } from 'entities'
import { DateTime } from 'luxon'

import { NewsSource } from '../constants'

class NewsModel {
  _id: number
  _title: string
  _content: string
  _source: NewsSource
  _lastUpdate: DateTime
  _availableLanguages: Record<string, number> | null
  _externalUrl: string | null

  constructor(params: {
    id: number
    title: string
    content: string
    lastUpdate: DateTime
    source: NewsSource
    availableLanguages: Record<string, number> | null
    externalUrl: string | null
  }) {
    this._id = params.id
    this._title = decodeHTML(params.title)
    this._content = decodeHTML(params.content)
    this._source = params.source
    this._lastUpdate = params.lastUpdate
    this._availableLanguages = params.availableLanguages
    this._externalUrl = params.externalUrl
  }

  get id(): number {
    return this._id
  }

  get title(): string {
    return this._title
  }

  get content(): string {
    return this._content
  }

  get source(): NewsSource {
    return this._source
  }

  get lastUpdate(): DateTime {
    return this._lastUpdate
  }

  get availableLanguages(): Record<string, number> | null {
    return this._availableLanguages
  }

  get externalUrl(): string | null {
    return this._externalUrl
  }
}

export default NewsModel
