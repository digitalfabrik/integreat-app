import { DateTime } from 'luxon'

import normalizePath from '../../utils/normalizePath'
import ExtendedPageModel from './ExtendedPageModel'
import OfferModel from './OfferModel'
import OrganizationModel from './OrganizationModel'
import PageModel from './PageModel'

class CategoryModel extends ExtendedPageModel {
  _root: boolean
  _parentPath: string
  _order: number
  _organization: OrganizationModel | null
  _embeddedOffers: OfferModel[]

  constructor(params: {
    root: boolean
    path: string
    title: string
    content: string
    thumbnail: string
    parentPath: string
    order: number
    availableLanguages: Map<string, string>
    lastUpdate: DateTime
    organization: OrganizationModel | null
    embeddedOffers: OfferModel[]
  }) {
    const { order, parentPath, root, organization, embeddedOffers, ...other } = params
    super(other)
    this._root = root
    this._parentPath = normalizePath(parentPath)
    this._order = order
    this._organization = organization
    this._embeddedOffers = embeddedOffers
  }

  get embeddedOffers(): OfferModel[] {
    return this._embeddedOffers
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
      (this.organization === null ? other.organization === null : this.organization.isEqual(other.organization)) &&
      this.embeddedOffers.length === other.embeddedOffers.length &&
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.embeddedOffers.every((offer, index) => offer.isEqual(other.embeddedOffers[index]!))
    )
  }
}

export default CategoryModel
