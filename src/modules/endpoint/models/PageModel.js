// @flow

import type Moment from 'moment'

class PageModel {
  _id: number
  _path: string
  _title: string
  _content: string
  _thumbnail: string
  _excerpt: string
  _availableLanguages: Map<string, string>
  _lastUpdate: Moment

  constructor ({id, path, title, content, thumbnail, excerpt, lastUpdate, availableLanguages}: {|id: number,
    path: string, title: string, content: string, thumbnail: string, excerpt: string, lastUpdate: Moment,
    availableLanguages: Map<string, string>|}) {
    this._id = id
    this._path = path
    this._title = title
    this._content = content
    this._thumbnail = thumbnail
    this._excerpt = excerpt
    this._lastUpdate = lastUpdate
    this._availableLanguages = availableLanguages
  }

  get id (): number {
    return this._id
  }

  get path (): string {
    return this._path
  }

  get title (): string {
    return this._title
  }

  get thumbnail (): string {
    return this._thumbnail
  }

  get content (): string {
    return this._content
  }

  get excerpt (): string {
    return this._excerpt
  }

  get lastUpdate (): Moment {
    return this._lastUpdate
  }

  get availableLanguages (): Map<string, string> {
    return this._availableLanguages
  }
}

export default PageModel
