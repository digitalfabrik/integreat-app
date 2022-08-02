class LocationModel<T> {
  _id: number
  _name: string
  _address: string
  _town: string
  _postcode: string
  _country: string
  _latitude: T
  _longitude: T

  constructor({
    id,
    name,
    address,
    town,
    postcode,
    country,
    latitude,
    longitude,
  }: {
    id: number
    name: string
    address: string
    town: string
    postcode: string
    country: string
    latitude: T
    longitude: T
  }) {
    this._id = id
    this._name = name
    this._address = address
    this._town = town
    this._postcode = postcode
    this._country = country
    this._latitude = latitude
    this._longitude = longitude
  }

  get id(): number {
    return this._id
  }

  get name(): string {
    return this._name
  }

  get address(): string {
    return this._address
  }

  get town(): string {
    return this._town
  }

  get postcode(): string {
    return this._postcode
  }

  get country(): string {
    return this._country
  }

  get longitude(): T {
    return this._longitude
  }

  get latitude(): T {
    return this._latitude
  }

  get fullAddress(): string {
    const town = `${this._postcode} ${this._town}`
    return [this._name, this._address, town].join(', ')
  }

  // Since there are different coordinate formats, we use [longitude, latitude]
  // https://docs.mapbox.com/help/glossary/lat-lon/#coordinate-format-handling
  get coordinates(): [T, T] {
    return [this.longitude, this.latitude]
  }

  isEqual(other: LocationModel<unknown>): boolean {
    return (
      this.id === other.id &&
      this.name === other.name &&
      this.address === other.address &&
      this.town === other.town &&
      this.postcode === other.postcode &&
      this.country === other.country &&
      this.longitude === other.longitude &&
      this.latitude === other.latitude
    )
  }
}

export default LocationModel
