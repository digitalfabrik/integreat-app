// @flow

class LocationModel {
  _address: ?string
  _town: ?string
  _postcode: ?string
  _latitude: ?string
  _longitude: ?string

  constructor ({address, town, postcode, latitude, longitude}: {|address: string, town: string, postcode: string,
    latitude: string, longitude: string|}) {
    this._address = address
    this._town = town
    this._postcode = postcode
    this._latitude = latitude
    this._longitude = longitude
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

  get location (): string {
    return `${this._address}, ${this._postcode} ${this._town}`
  }
}

export default LocationModel
