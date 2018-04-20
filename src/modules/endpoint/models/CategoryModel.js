// @flow

import type { Moment } from 'moment'

class CategoryModel {
  _id: number
  _url: string
  _path: string
  _title: string
  _content: string
  _parentId: number
  _parentUrl: string
  _thumbnail: string
  _order: number
  _availableLanguages: Map<string, string>
  _lastUpdate: Moment

  constructor (params: {| id: number, path: string, url: string, title: string, content: string, parentId: number, thumbnail: string,
    parentUrl: string, order: number, availableLanguages: Map<string, string>, lastUpdate: Moment |}) {
    this._id = params.id
    this._url = params.url
    this._title = params.title
    this._content = params.content
    this._parentId = params.parentId
    this._parentUrl = params.parentUrl
    this._thumbnail = params.thumbnail
    this._order = params.order
    this._path = params.path
    this._availableLanguages = params.availableLanguages
    this._lastUpdate = params.lastUpdate
  }

  get thumbnail (): string {
    return this._thumbnail
  }

  get id (): number {
    return this._id
  }

  get url (): string {
    return this._url
  }

  get path (): string {
    return this._path
  }

  get title (): string {
    return this._title
  }

  get content (): string {
    return this._content
  }

  get parentId (): number {
    return this._parentId
  }

  get parentUrl (): string {
    return this._parentUrl
  }

  setParentUrl (parentUrl: string) {
    this._parentUrl = parentUrl
  }

  get order (): number {
    return this._order
  }

  get availableLanguages (): Map<string, string> {
    return this._availableLanguages
  }

  getLastUpdate (locale: string): Moment {
    const lastUpdate = this._lastUpdate
    lastUpdate.locale(locale)

    // only return day, month and year
    return lastUpdate.format('LL')
  }
}

export default CategoryModel
