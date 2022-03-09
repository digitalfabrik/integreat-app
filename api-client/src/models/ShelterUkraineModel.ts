import {
  ShelterUkraineAccommodationType,
  ShelterUkraineHostType,
  ShelterUkraineInfo,
  ShelterUkraineLanguage,
  ShelterUkrainePeriod
} from '../types'

class ShelterUkraineModel {
  _id: number
  _name: string
  _quarter: string
  _city: string
  _zipcode: string
  _languages: ShelterUkraineLanguage[]
  _accommodationType: ShelterUkraineAccommodationType
  _info: ShelterUkraineInfo[]
  _email: string
  _phone: string
  _rooms: number
  _occupants: number
  _startDate: string
  _period: ShelterUkrainePeriod
  _hostType: ShelterUkraineHostType

  constructor(params: {
    id: number
    name: string
    quarter: string
    city: string
    zipcode: string
    languages: ShelterUkraineLanguage[]
    accommodationType: ShelterUkraineAccommodationType
    info: ShelterUkraineInfo[]
    email: string
    phone: string
    rooms: string
    occupants: string
    startDate: string
    period: ShelterUkrainePeriod
    hostType: ShelterUkraineHostType
  }) {
    this._id = params.id
    this._name = params.name
    this._quarter = params.quarter
    this._city = params.city
    this._zipcode = params.zipcode
    this._languages = params.languages
    this._accommodationType = params.accommodationType
    this._info = params.info
    this._email = params.email
    this._phone = params.phone
    this._rooms = parseInt(params.rooms, 10)
    this._occupants = parseInt(params.occupants, 10)
    this._startDate = params.startDate
    this._period = params.period
    this._hostType = params.hostType
  }

  get id(): number {
    return this._id
  }

  get name(): string {
    return this._name
  }

  get quarter(): string {
    return this._quarter
  }

  get city(): string {
    return this._city
  }

  get zipcode(): string {
    return this._zipcode
  }

  get languages(): ShelterUkraineLanguage[] {
    return this._languages
  }

  get accommodationType(): ShelterUkraineAccommodationType {
    return this._accommodationType
  }

  get info(): ShelterUkraineInfo[] {
    return this._info
  }

  get email(): string {
    return this._email
  }

  get phone(): string {
    return this._phone
  }

  get rooms(): number {
    return this._rooms
  }

  get occupants(): number {
    return this._occupants
  }

  get startDate(): string {
    return this._startDate
  }

  get period(): ShelterUkrainePeriod {
    return this._period
  }

  get hostType(): ShelterUkraineHostType {
    return this._hostType
  }
}

export default ShelterUkraineModel
