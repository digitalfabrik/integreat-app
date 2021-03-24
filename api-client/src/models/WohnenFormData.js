// @flow

import type Moment from 'moment'

export interface LandlordType {
  +firstName: string;
  +lastName: string;
  +phone: string;
}

export interface AccommodationType {
  +ofRooms: Array<string>;
  +title: string;
  +location: string;
  +totalArea: number;
  +totalRooms: number;
  +moveInDate: Moment;
  +ofRoomsDiff: Array<string>;
}

export interface CostsType {
  +ofRunningServices: Array<string>;
  +ofAdditionalServices: Array<string>;
  +baseRent: number;
  +runningCosts: number;
  +hotWaterInHeatingCosts: boolean;
  +additionalCosts: number;
  +ofRunningServicesDiff: Array<string>;
  +ofAdditionalServicesDiff: Array<string>;
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
