// @flow

import type Moment from 'moment'
import CategoriesMapModel from './CategoriesMapModel'

class CategoryModel {
  _id: number
  _path: string
  _title: string
  _content: string
  _parentPath: string
  _thumbnail: string
  _order: number
  _availableLanguages: Map<string, string>
  _lastUpdate: ?Moment

  constructor (params: {| id: number, path: string, title: string, content: string, thumbnail: string,
    parentPath: string, order: number, availableLanguages: Map<string, string>, lastUpdate: ?Moment |}) {
    this._id = params.id
    this._path = params.path
    this._title = params.title
    this._content = params.content
    this._parentPath = params.parentPath
    this._thumbnail = params.thumbnail
    this._order = params.order
    this._availableLanguages = params.availableLanguages
    this._lastUpdate = params.lastUpdate
  }

  get thumbnail (): string {
    return this._thumbnail
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

  get content (): string {
    return this._content
  }

  get parentPath (): string {
    return this._parentPath
  }

  get order (): number {
    return this._order
  }

  get availableLanguages (): Map<string, string> {
    return this._availableLanguages
  }

  get lastUpdate (): ?Moment {
    return this._lastUpdate
  }

  isRoot (): boolean {
    return this.id === 0
  }

  isLeaf (categories: CategoriesMapModel): boolean {
    return categories.getChildren(this).length === 0
  }
}

export default CategoryModel
