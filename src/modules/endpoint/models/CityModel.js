// @flow

class CityModel {
  _name: string
  _code: string
  _live: boolean
  _eventsEnabled: boolean
  _extrasEnabled: boolean
  _sortingName: string

  constructor (params: {|name: string, code: string, live: boolean, eventsEnabled: boolean, extrasEnabled: boolean,
    sortingName: string|}) {
    this._name = params.name
    this._code = params.code
    this._live = params.live
    this._eventsEnabled = params.eventsEnabled
    this._extrasEnabled = params.extrasEnabled
    this._sortingName = params.sortingName
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

  static findCityName (cities: Array<CityModel>, code: string): string {
    const city = cities.find(city => city.code === code)
    return city ? city.name : code
  }
}

export default CityModel
