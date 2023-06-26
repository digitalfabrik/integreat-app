import { Moment } from 'moment'

import normalizePath from '../normalizePath'
import ExtendedPageModel from './ExtendedPageModel'
import OrganizationModel from './OrganizationModel'
import PageModel from './PageModel'

class CategoryModel extends ExtendedPageModel {
  _root: boolean
  _parentPath: string
  _order: number
  _organization: OrganizationModel | null

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
    organization: OrganizationModel | null
  }) {
    const { order, parentPath, root, organization, ...other } = params
    super(other)
    this._root = root
    this._parentPath = normalizePath(parentPath)
    this._order = order
    this._organization = organization
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

  get organization(): OrganizationModel | null {
    return this._organization
  }

  isEqual(other: PageModel): boolean {
    return (
      other instanceof CategoryModel &&
      super.isEqual(other) &&
      this.parentPath === other.parentPath &&
      this.order === other.order &&
      this.isRoot === other.isRoot &&
      this.organization === other.organization
    )
  }
}

export default CategoryModel
