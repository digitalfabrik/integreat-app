import { Moment } from 'moment'

import { mapMarker, PoiFeature } from '../maps'
import ExtendedPageModel from './ExtendedPageModel'
import LocationModel from './LocationModel'
import PageModel from './PageModel'

class PoiModel extends ExtendedPageModel {
  _location: LocationModel
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
    location: LocationModel
    lastUpdate: Moment
    email: string | null
    website: string | null
    phoneNumber: string | null
    hash: string
  }) {
    const { location, excerpt, website, phoneNumber, email, ...other } = params
    super(other)
    this._location = location
    this._excerpt = excerpt
    this._website = website
    this._phoneNumber = phoneNumber
    this._email = email
  }

  get location(): LocationModel {
    return this._location
  }

  get excerpt(): string {
    return this._excerpt
  }

  get urlSlug(): string {
    return this._path.split('/').pop() ?? ''
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

  get featureLocation(): PoiFeature | null {
    const { coordinates, name, id, address } = this.location
    if (coordinates === null) {
      return null
    }

    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates
      },
      properties: {
        title: name,
        id,
        // TODO gonna be replaced by proper mapping category->symbolName IGAPP-736
        symbol: mapMarker.symbol,
        thumbnail: this.thumbnail,
        path: this.path,
        urlSlug: this.urlSlug,
        address: address ?? undefined
      }
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
