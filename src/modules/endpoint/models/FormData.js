// @flow

import type Moment from 'moment'

export default class FormData {
  landlord: {
    firstName: string,
    lastName: string,
    phone: string
  }
  accommodation: {
    ofRooms: Array<string>,
    title: string,
    location: string,
    totalArea: number,
    totalRooms: number,
    moveInDate: Moment,
    ofRoomsDiff: Array<string>
  }
  costs: {
    ofRunningServices: Array<string>,
    ofAdditionalServices: Array<string>,
    baseRent: number,
    runningCosts: number,
    hotWaterInHeatingCosts: boolean,
    additionalCosts: number,
    ofRunningServicesDiff: Array<string>,
    ofAdditionalServicesDiff: Array<string>
  }
}
