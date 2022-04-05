import {
  ShelterAccommodationType,
  ShelterCostsType,
  ShelterHostType,
  ShelterInfo,
  ShelterLanguage,
  ShelterPeriod
} from '../types'

class ShelterModel {
  _id: number
  _name: string
  _city: string
  _zipcode: string
  _languages: ShelterLanguage[]
  _beds: number
  _accommodationType: ShelterAccommodationType
  _info: ShelterInfo[]
  _email: string | null
  _phone: string | null
  _rooms: number | null
  _occupants: number | null
  _startDate: string
  _period: ShelterPeriod
  _hostType: ShelterHostType
  _costs: ShelterCostsType
  _comments: string | null

  constructor(params: {
    id: number
    name: string
    city: string
    zipcode: string
    languages: ShelterLanguage[]
    beds: string
    accommodationType: ShelterAccommodationType
    info: ShelterInfo[]
    email: string | null
    phone: string | null
    rooms: string | null
    occupants: string | null
    startDate: string
    period: ShelterPeriod
    hostType: ShelterHostType
    costs: ShelterCostsType
    comments: string | null
  }) {
    this._id = params.id
    this._name = params.name.trim()
    this._city = params.city.trim()
    this._zipcode = params.zipcode.trim()
    this._languages = params.languages
    this._beds = parseInt(params.beds, 10)
    this._accommodationType = params.accommodationType
    this._info = params.info
    this._email = params.email?.trim() ?? null
    this._phone = params.phone?.trim() ?? null
    this._rooms = params.rooms ? parseInt(params.rooms, 10) : null
    this._occupants = params.occupants ? parseInt(params.occupants, 10) : null
    this._startDate = params.startDate
    this._period = params.period
    this._hostType = params.hostType
    this._costs = params.costs
    this._comments = params.comments?.trim() ?? null
  }

  get id(): number {
    return this._id
  }

  get name(): string {
    return this._name
  }

  get city(): string {
    return this._city
  }

  get zipcode(): string {
    return this._zipcode
  }

  get languages(): ShelterLanguage[] {
    return this._languages
  }

  get beds(): number {
    return this._beds
  }

  get accommodationType(): ShelterAccommodationType {
    return this._accommodationType
  }

  get info(): ShelterInfo[] {
    return this._info
  }

  get email(): string | null {
    return this._email
  }

  get phone(): string | null {
    return this._phone
  }

  get rooms(): number | null {
    return this._rooms
  }

  get occupants(): number | null {
    return this._occupants
  }

  get startDate(): string {
    return this._startDate
  }

  get period(): ShelterPeriod {
    return this._period
  }

  get hostType(): ShelterHostType {
    return this._hostType
  }

  get costs(): ShelterCostsType {
    return this._costs
  }

  get comments(): string | null {
    return this._comments
  }
}

export default ShelterModel
