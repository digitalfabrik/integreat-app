import type Moment from 'moment'
import ExtendedPageModel from './ExtendedPageModel'
import PageModel from './PageModel'

class CategoryModel extends ExtendedPageModel {
  _root: boolean
  _parentPath: string
  _order: number

  constructor(params: {
    root: boolean
    path: string
    title: string
    content: string
    thumbnail: string
    parentPath: string
    order: number
    availableLanguages: Map<string, string>
    lastUpdate: Moment
    hash: string
  }) {
    const { order, parentPath, root, ...other } = params
    super(other)
    this._root = root
    this._parentPath = parentPath
    this._order = order
  }

  get parentPath(): string {
    return this._parentPath
  }

  get order(): number {
    return this._order
  }

  isRoot(): boolean {
    return this._root
  }

  isEqual(other: PageModel): boolean {
    return (
      other instanceof CategoryModel &&
      super.isEqual(other) &&
      this.parentPath === other.parentPath &&
      this.order === other.order &&
      this.isRoot === other.isRoot
    )
  }
}

export default CategoryModel