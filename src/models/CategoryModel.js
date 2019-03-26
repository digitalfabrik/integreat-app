// @flow

import type Moment from 'moment'
import CategoriesMapModel from './CategoriesMapModel'
import ExtendedPageModel from './ExtendedPageModel'

class CategoryModel extends ExtendedPageModel {
  _root: boolean
  _parentPath: string
  _order: number

  constructor (params: {|
    root: boolean, path: string, title: string, content: string, thumbnail: string,
    parentPath: string, order: number, availableLanguages: Map<string, string>, lastUpdate: Moment, hash: string
  |}) {
    const { order, parentPath, root, ...other } = params
    super(other)
    this._root = root
    this._parentPath = parentPath
    this._order = order
  }

  get parentPath (): string {
    return this._parentPath
  }

  get order (): number {
    return this._order
  }

  isRoot (): boolean {
    return this._root
  }

  isLeaf (categories: CategoriesMapModel): boolean {
    return categories.getChildren(this).length === 0
  }
}

export default CategoryModel
