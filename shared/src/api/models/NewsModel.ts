import { decodeHTML } from 'entities'
import { DateTime } from 'luxon'

import { MAX_DAYS_NEW } from '../../constants/index.ts'
import { NewsSource } from '../constants/index.ts'

class NewsModel {
  _title: string
  _content: string
  _source: NewsSource
  _lastUpdate: DateTime
  constructor(params: {
    id: string
    title: string
    content: string
    lastUpdate: DateTime
    publishedAt: DateTime
    source: NewsSource
    availableLanguages: Record<string, string> | null
    externalUrl: string
  }) {
    this._id = params.id
    this._title = decodeHTML(params.title)
    this._content = decodeHTML(params.content)
    this._source = params.source
    this._lastUpdate = params.lastUpdate
    this._publishedAt = params.publishedAt
    this._availableLanguages = params.availableLanguages
    this._externalUrl = params.externalUrl
  }
  _externalUrl: string

  _publishedAt: DateTime

  _id: string

  get id(): string {
    return this._id
  }

  _availableLanguages: Record<string, string> | null

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

  get publishedAt(): DateTime {
    return this._publishedAt
  }

  get isNew(): boolean {
    return DateTime.now().diff(this._publishedAt).as('days') < MAX_DAYS_NEW
  }

  get availableLanguages(): Record<string, string> | null {
    return this._availableLanguages
  }

  get externalUrl(): string {
    return this._externalUrl
  }
}

export default NewsModel
