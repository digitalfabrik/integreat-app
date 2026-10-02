import { decodeHTML } from 'entities'
import { DateTime } from 'luxon'

import { MAX_DAYS_NEW } from '../../constants/index.ts'
import { getSlugFromPath } from '../../utils/index.ts'
import normalizePath from '../../utils/normalizePath.ts'

class DocumentModel {
  _id: number
  _path: string
  _title: string
  _content: string
  _lastUpdate: DateTime
  _publishedAt: DateTime

  constructor({
    id,
    path,
    title,
    content,
    lastUpdate,
    publishedAt,
  }: {
    id: number
    path: string
    title: string
    content: string
    lastUpdate: DateTime
    publishedAt: DateTime
  }) {
    this._id = id
    this._path = normalizePath(path)
    this._title = decodeHTML(title)
    this._content = content
    this._lastUpdate = lastUpdate
    this._publishedAt = publishedAt
  }

  get id(): number {
    return this._id
  }

  get path(): string {
    return this._path
  }

  get slug(): string {
    return getSlugFromPath(this._path)
  }

  get title(): string {
    return this._title
  }

  get content(): string {
    return this._content
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

  isEqual(other: DocumentModel): boolean {
    return this.path === other.path && this.content === other.content && this.lastUpdate.equals(other.lastUpdate)
  }
}

export default DocumentModel
