class CityModel {
  _name: string
  _code: string
  _live: boolean
  _eventsEnabled: boolean
  _offersEnabled: boolean
  _poisEnabled: boolean
  _pushNotificationsEnabled: boolean
  _tunewsEnabled: boolean
  _sortingName: string
  _prefix: string | null | undefined
  _latitude: number | null
  _longitude: number | null
  _aliases: Record<
    string,
    {
      longitude: number
      latitude: number
    }
  > | null

  constructor(params: {
    name: string
    code: string
    live: boolean
    poisEnabled: boolean
    eventsEnabled: boolean
    offersEnabled: boolean
    pushNotificationsEnabled: boolean
    tunewsEnabled: boolean
    sortingName: string
    prefix: string | null | undefined
    latitude: number | null
    longitude: number | null
    aliases: Record<
      string,
      {
        longitude: number
        latitude: number
      }
    > | null
  }) {
    this._name = params.name
    this._code = params.code
    this._live = params.live
    this._eventsEnabled = params.eventsEnabled
    this._offersEnabled = params.offersEnabled
    this._poisEnabled = params.poisEnabled
    this._pushNotificationsEnabled = params.pushNotificationsEnabled
    this._tunewsEnabled = params.tunewsEnabled
    this._sortingName = params.sortingName
    this._prefix = params.prefix
    this._latitude = params.latitude
    this._longitude = params.longitude
    this._aliases = params.aliases
  }

  get live(): boolean {
    return this._live
  }

  get name(): string {
    return this._name
  }

  get code(): string {
    return this._code
  }

  get sortingName(): string {
    return this._sortingName
  }

  get eventsEnabled(): boolean {
    return this._eventsEnabled
  }

  get offersEnabled(): boolean {
    return this._offersEnabled
  }

  get poisEnabled(): boolean {
    return this._poisEnabled
  }

  get pushNotificationsEnabled(): boolean {
    return this._pushNotificationsEnabled
  }

  get tunewsEnabled(): boolean {
    return this._tunewsEnabled
  }

  get sortCategory(): string {
    return this._sortingName.charAt(0)
  }

  get prefix(): string | null | undefined {
    return this._prefix
  }

  get longitude(): number | null {
    return this._longitude
  }

  get latitude(): number | null {
    return this._latitude
  }

  get aliases(): Record<
    string,
    {
      longitude: number
      latitude: number
    }
  > | null {
    return this._aliases
  }

  static findCityName(cities: ReadonlyArray<CityModel>, code: string): string {
    const city = cities.find(city => city.code === code)
    return city ? city.name : code
  }
}

export default CityModel
