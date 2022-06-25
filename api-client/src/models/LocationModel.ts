import { Position } from 'geojson'

class LocationModel {
  _id: number
  _name: string
  _address: string
  _town: string
  _postcode: string
  _country: string
  _latitude: string | null
  _longitude: string | null

  constructor({
    id,
    name,
    address,
    town,
    postcode,
    country,
    latitude,
    longitude
  }: {
    id: number
    name: string
    address: string
    town: string
    postcode: string
    country: string
    latitude: string | null
    longitude: string | null
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

  get longitude(): string | null {
    return this._longitude
  }

  get latitude(): string | null {
    return this._latitude
  }

  get fullAddress(): string {
    const town = `${this._postcode} ${this._town}`
    return [this._name, this._address, town].join(', ')
  }

  isEqual(other: LocationModel): boolean {
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

  // since there are different coordinate format handlings, we use [long,lat] https://docs.mapbox.com/help/glossary/lat-lon/#coordinate-format-handling
  get coordinates(): Position | null {
    if (!this.longitude || !this.latitude) {
      return null
    }
    return [Number(this.longitude), Number(this.latitude)]
  }
}

export default LocationModel
