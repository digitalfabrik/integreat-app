import { decodeHTML } from 'entities'
import { DateTime } from 'luxon'

import { getSlugFromPath } from '../../utils'
import normalizePath from '../../utils/normalizePath'

class DocumentModel {
  _id: number
  _path: string
  _title: string
  _content: string
  _lastUpdate: DateTime

  constructor({
    id,
    path,
    title,
    content,
    lastUpdate,
  }: {
    id: number
    path: string
    title: string
    content: string
    lastUpdate: DateTime
  }) {
    this._id = id
    this._path = normalizePath(path)
    this._title = decodeHTML(title)
    this._content = content
    this._lastUpdate = lastUpdate
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

  isEqual(other: DocumentModel): boolean {
    return this.path === other.path && this.content === other.content && this.lastUpdate.equals(other.lastUpdate)
  }
}

export default DocumentModel
