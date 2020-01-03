// @flow

class LocationModel {
  _name: ?string
  _address: ?string
  _town: ?string
  _postcode: ?string
  _latitude: ?string
  _longitude: ?string

  constructor ({ name, address, town, postcode, latitude, longitude }: {| name: ?string, address: ?string,
    town: ?string, postcode: ?string, latitude: ?string, longitude: ?string |}) {
    this._address = address
    this._town = town
    this._postcode = postcode
    this._latitude = latitude
    this._longitude = longitude
    this._name = name
  }

  get name (): ?string {
    return this._name
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

  get location (): ?string {
    if (!this._town) {
      return null
    }
    const withoutAddress = this._postcode ? `${this._postcode} ${this._town}` : this._town
    if (!this._address) {
      return withoutAddress
    }
    return `${this._address}, ${withoutAddress}`
  }
}

export default LocationModel
