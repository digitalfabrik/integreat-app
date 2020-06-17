// @flow

class LocationModel {
  _name: ?string
  _address: ?string
  _town: ?string
  _state: ?string
  _postcode: ?string
  _region: ?string
  _country: ?string
  _latitude: ?string
  _longitude: ?string

  constructor ({ name, address, town, state, postcode, region, country, latitude, longitude }: {|
                 name: ?string, address: ?string, town: ?string, state: ?string, postcode: ?string, region: ?string,
                 country: ?string, latitude?: ?string, longitude?: ?string
               |}
  ) {
    this._name = name
    this._address = address
    this._town = town
    this._state = state
    this._postcode = postcode
    this._region = region
    this._country = country
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

  get state (): ?string {
    return this._state
  }

  get postcode (): ?string {
    return this._postcode
  }

  get region (): ?string {
    return this._region
  }

  get country (): ?string {
    return this._country
  }

  get longitude (): ?string {
    return this._longitude
  }

  get latitude (): ?string {
    return this._latitude
  }

  get location (): ?string {
    const town = this._postcode && this._town ? `${this._postcode} ${this._town}` : this._town
    if (!town && !this._address && !this._name) {
      return null
    }
    return [this._name, this._address, town]
      .filter(value => !!value)
      .join(', ')
  }
}

export default LocationModel
