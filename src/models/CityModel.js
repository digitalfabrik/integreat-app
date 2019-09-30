// @flow

class CityModel {
  _name: string
  _code: string
  _live: boolean
  _eventsEnabled: boolean
  _extrasEnabled: boolean
  _sortingName: string
  _prefix: ?string
  _latitude: number | null
  _longitude: number | null
  _aliases: { [alias: string]: {| longitude: number, latitude: number |} } | null

  constructor (params: {|
    name: string, code: string, live: boolean, eventsEnabled: boolean, extrasEnabled: boolean,
    sortingName: string, prefix: ?string, latitude: number | null, longitude: number | null,
    aliases: { [alias: string]: {| longitude: number, latitude: number |} } | null
  |}) {
    this._name = params.name
    this._code = params.code
    this._live = params.live
    this._eventsEnabled = params.eventsEnabled
    this._extrasEnabled = params.extrasEnabled
    this._sortingName = params.sortingName
    this._prefix = params.prefix
    this._latitude = params.latitude
    this._longitude = params.longitude
    this._aliases = params.aliases
  }

  get live (): boolean {
    return this._live
  }

  get name (): string {
    return this._name
  }

  get code (): string {
    return this._code
  }

  get sortingName (): string {
    return this._sortingName
  }

  get eventsEnabled (): boolean {
    return this._eventsEnabled
  }

  get extrasEnabled (): boolean {
    return this._extrasEnabled
  }

  get sortCategory (): string {
    return this._sortingName.charAt(0)
  }

  get prefix (): ?string {
    return this._prefix
  }

  get longitude (): number | null {
    return this._longitude
  }

  get latitude (): number | null {
    return this._latitude
  }

  get aliases (): { [alias: string]: {| longitude: number, latitude: number |} } | null {
    return this._aliases
  }

  static findCityName (cities: Array<CityModel>, code: string): string {
    const city = cities.find(city => city.code === code)
    return city ? city.name : code
  }
}

export default CityModel
