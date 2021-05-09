import type Moment from 'moment'
export interface LandlordType {
  readonly firstName: string
  readonly lastName: string
  readonly phone: string
}
export interface AccommodationType {
  readonly ofRooms: Array<string>
  readonly title: string
  readonly location: string
  readonly totalArea: number
  readonly totalRooms: number
  readonly moveInDate: Moment
  readonly ofRoomsDiff: Array<string>
}
export interface CostsType {
  readonly ofRunningServices: Array<string>
  readonly ofAdditionalServices: Array<string>
  readonly baseRent: number
  readonly runningCosts: number
  readonly hotWaterInHeatingCosts: boolean
  readonly additionalCosts: number
  readonly ofRunningServicesDiff: Array<string>
  readonly ofAdditionalServicesDiff: Array<string>
}
export default class WohnenFormData {
  _landlord: LandlordType
  _accommodation: AccommodationType
  _costs: CostsType

  constructor(landlord: LandlordType, accommodation: AccommodationType, costs: CostsType) {
    this._landlord = landlord
    this._accommodation = accommodation
    this._costs = costs
  }

  get landlord(): LandlordType {
    return this._landlord
  }

  get accommodation(): AccommodationType {
    return this._accommodation
  }

  get costs(): CostsType {
    return this._costs
  }
}