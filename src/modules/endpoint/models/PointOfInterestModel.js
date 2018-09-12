// @flow

import moment from 'moment'

class PointOfInterestModel {
  _id: number
  _path: string
  _title: string
  _content: string
  _thumbnail: string
  _availableLanguages: Map<string, string>
  _excerpt: string
  _address: ?string
  _town: ?string
  _postcode: ?string
  _latitude: ?string
  _longitude: ?string
  _lastUpdate: moment

  constructor ({id, path, title, content, thumbnail, availableLanguages, excerpt, address, town, postcode, longitude,
    latitude, lastUpdate}: {id: number, path: string, title: string, content: string, thumbnail: string,
    availableLanguages: Map<string, string>, excerpt: string, address: ?string, town: ?string, postcode: ?string,
    latitude: ?string, longitude: ?string, lastUpdate: moment}) {
    this._id = id
    this._title = title
    this._content = content
    this._thumbnail = thumbnail
    this._address = address
    this._town = town
    this._excerpt = excerpt
    this._availableLanguages = availableLanguages
    this._postcode = postcode
    this._latitude = latitude
    this._longitude = longitude
    this._lastUpdate = lastUpdate
    this._path = path
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

  get thumbnail (): string {
    return this._thumbnail
  }

  get availableLanguages (): Map<string, string> {
    return this._availableLanguages
  }

  get excerpt (): string {
    return this._excerpt
  }

  get address (): ?string {
    return this._address
  }

  get town (): ?string {
    return this._town
  }

  get postcode (): ?string {
    return this._postcode
  }

  get longitude (): ?string {
    return this._longitude
  }

  get latitude (): ?string {
    return this._latitude
  }

  get lastUpdate (): moment {
    return this._lastUpdate
  }
}

export default PointOfInterestModel
