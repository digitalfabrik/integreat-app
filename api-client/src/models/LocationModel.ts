class LocationModel {
  _name: string | null | undefined
  _address: string | null | undefined
  _town: string | null | undefined
  _state: string | null | undefined
  _postcode: string | null | undefined
  _region: string | null | undefined
  _country: string | null | undefined
  _latitude: string | null | undefined
  _longitude: string | null | undefined

  constructor({
    name,
    address,
    town,
    state,
    postcode,
    region,
    country,
    latitude,
    longitude
  }: {
    name: string | null | undefined
    address: string | null | undefined
    town: string | null | undefined
    state: string | null | undefined
    postcode: string | null | undefined
    region: string | null | undefined
    country: string | null | undefined
    latitude?: string | null | undefined
    longitude?: string | null | undefined
  }) {
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

  get name(): string | null | undefined {
    return this._name
  }

  get address(): string | null | undefined {
    return this._address
  }

  get town(): string | null | undefined {
    return this._town
  }

  get state(): string | null | undefined {
    return this._state
  }

  get postcode(): string | null | undefined {
    return this._postcode
  }

  get region(): string | null | undefined {
    return this._region
  }

  get country(): string | null | undefined {
    return this._country
  }

  get longitude(): string | null | undefined {
    return this._longitude
  }

  get latitude(): string | null | undefined {
    return this._latitude
  }

  get location(): string | null | undefined {
    const town = this._postcode && this._town ? `${this._postcode} ${this._town}` : this._town

    if (!town && !this._address && !this._name) {
      return null
    }

    return [this._name, this._address, town].filter(value => !!value).join(', ')
  }

  isEqual(other: LocationModel): boolean {
    return (
      this.name === other.name &&
      this.address === other.address &&
      this.town === other.town &&
      this.state === other.state &&
      this.postcode === other.postcode &&
      this.region === other.region &&
      this.country === other.country &&
      this.longitude === other.longitude &&
      this.latitude === other.latitude
    )
  }
}

export default LocationModel