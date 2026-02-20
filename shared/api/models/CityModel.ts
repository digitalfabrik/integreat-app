// eslint-disable-next-line import-x/no-extraneous-dependencies
import { BBox } from 'geojson'

import LanguageModel from './LanguageModel'

type CoordinateType = { latitude: number; longitude: number }

class CityModel {
  _name: string
  _code: string
  _live: boolean
  _languages: LanguageModel[]
  _chatEnabled: boolean
  _chatPrivacyPolicyUrl: string | null
  _eventsEnabled: boolean
  _poisEnabled: boolean
  _localNewsEnabled: boolean
  _tunewsEnabled: boolean
  _sortingName: string
  _prefix: string | null
  _latitude: number
  _longitude: number

  constructor(params: {
    name: string
    code: string
    live: boolean
    languages: LanguageModel[]
    poisEnabled: boolean
    eventsEnabled: boolean
    localNewsEnabled: boolean
    chatEnabled: boolean
    tunewsEnabled: boolean
    sortingName: string
    prefix: string | null
    latitude: number
    longitude: number
    aliases: Record<string, CoordinateType> | null
    boundingBox: BBox
    chatPrivacyPolicyUrl: string | null
  }) {
    this._name = params.name
    this._code = params.code
    this._live = params.live
    this._languages = params.languages
    this._chatEnabled = params.chatEnabled
    this._eventsEnabled = params.eventsEnabled
    this._poisEnabled = params.poisEnabled
    this._localNewsEnabled = params.localNewsEnabled
    this._tunewsEnabled = params.tunewsEnabled
    this._sortingName = params.sortingName
    this._prefix = params.prefix
    this._latitude = params.latitude
    this._longitude = params.longitude
    this._aliases = params.aliases
    this._boundingBox = params.boundingBox
    this._chatPrivacyPolicyUrl = params.chatPrivacyPolicyUrl
  }

  _boundingBox: BBox

  get boundingBox(): BBox {
    return this._boundingBox
  }

  get live(): boolean {
    return this._live
  }

  get name(): string {
    return this._name
  }

  get languages(): LanguageModel[] {
    return this._languages
  }

  get code(): string {
    return this._code
  }

  get sortingName(): string {
    return this._sortingName
  }

  get chatEnabled(): boolean {
    return this._chatEnabled
  }

  get eventsEnabled(): boolean {
    return this._eventsEnabled
  }

  get poisEnabled(): boolean {
    return this._poisEnabled
  }

  get localNewsEnabled(): boolean {
    return this._localNewsEnabled
  }

  get tunewsEnabled(): boolean {
    return this._tunewsEnabled
  }

  get sortCategory(): string {
    return this._sortingName.charAt(0)
  }

  get prefix(): string | null {
    return this._prefix
  }

  get longitude(): number {
    return this._longitude
  }

  get latitude(): number {
    return this._latitude
  }

  get chatPrivacyPolicyUrl(): string | null {
    return this._chatPrivacyPolicyUrl
  }

  _aliases: Record<string, CoordinateType> | null

  get aliases(): Record<string, CoordinateType> | null {
    return this._aliases
  }

  static findCityName(cities: readonly CityModel[], code: string): string {
    const city = cities.find(city => city.code === code)
    return city ? city.name : code
  }
}

export default CityModel
