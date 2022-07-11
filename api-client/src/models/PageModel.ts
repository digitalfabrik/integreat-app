import { decodeHTML } from 'entities'
import { Moment } from 'moment'

import normalizePath from '../normalizePath'

class PageModel {
  _path: string
  _title: string
  _content: string
  _lastUpdate: Moment

  constructor({
    path,
    title,
    content,
    lastUpdate
  }: {
    path: string
    title: string
    content: string
    lastUpdate: Moment
  }) {
    this._path = normalizePath(path)
    this._title = decodeHTML(title)
    this._content = content
    this._lastUpdate = lastUpdate
  }

  get path(): string {
    return this._path
  }

  get title(): string {
    return this._title
  }

  get content(): string {
    return this._content
  }

  get lastUpdate(): Moment {
    return this._lastUpdate
  }

  isEqual(other: PageModel): boolean {
    return this.path === other.path && this.content === other.content && this.lastUpdate.isSame(other.lastUpdate)
  }
}

export default PageModel
