import { Moment } from 'moment'

import { mapMarker, PoiFeature } from '../maps'
import ExtendedPageModel from './ExtendedPageModel'
import LocationModel from './LocationModel'
import PageModel from './PageModel'

class PoiModel extends ExtendedPageModel {
  _location: LocationModel<number>
  _excerpt: string
  _website: string | null
  _phoneNumber: string | null
  _email: string | null

  constructor(params: {
    path: string
    title: string
    content: string
    thumbnail: string
    availableLanguages: Map<string, string>
    excerpt: string
    location: LocationModel<number>
    lastUpdate: Moment
    email: string | null
    website: string | null
    phoneNumber: string | null
  }) {
    const { location, excerpt, website, phoneNumber, email, ...other } = params
    super(other)
    this._location = location
    this._excerpt = excerpt
    this._website = website
    this._phoneNumber = phoneNumber
    this._email = email
  }

  get location(): LocationModel<number> {
    return this._location
  }

  get excerpt(): string {
    return this._excerpt
  }

  get website(): string | null {
    return this._website
  }

  get phoneNumber(): string | null {
    return this._phoneNumber
  }

  get email(): string | null {
    return this._email
  }

  get featureLocation(): PoiFeature {
    const { coordinates, name, id, address } = this.location

    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates,
      },
      properties: {
        title: name,
        id,
        // TODO IGAPP-736: Replace by proper mapping category->symbolName
        symbol: mapMarker.symbol,
        thumbnail: this.thumbnail,
        path: this.path,
        slug: this.slug,
        address,
        closeToOtherPoi: false,
      },
    }
  }

  isEqual(other: PageModel): boolean {
    return (
      other instanceof PoiModel &&
      super.isEqual(other) &&
      this.location.isEqual(other.location) &&
      this.excerpt === other.excerpt
    )
  }
}

export default PoiModel
