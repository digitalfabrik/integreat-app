import { Moment } from 'moment'

class PageModel {
  _path: string
  _title: string
  _content: string
  _lastUpdate: Moment
  _hash: string

  constructor({
    path,
    title,
    content,
    lastUpdate,
    hash
  }: {
    path: string
    title: string
    content: string
    lastUpdate: Moment
    hash: string
  }) {
    this._path = path
    this._title = title
    this._content = content
    this._lastUpdate = lastUpdate
    this._hash = hash
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

  get hash(): string {
    return this._hash
  }

  isEqual(other: PageModel): boolean {
    return (
      this.path === other.path &&
      this.content === other.content &&
      this.lastUpdate.isSame(other.lastUpdate) &&
      this.hash === other.hash
    )
  }
}

export default PageModel
