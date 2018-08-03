// @flow

import EndpointBuilder from '../EndpointBuilder'
import ParamMissingError from '../errors/ParamMissingError'
import WohnenOfferModel from '../models/WohnenOfferModel'
import WohnenFormData from '../models/WohnenFormData'
import moment from 'moment'

const WOHNEN_ENDPOINT_NAME = 'wohnen'

// Generated with: https://transform.now.sh/json-to-flow-types/
type AccommodationType = {
  ofRooms: string[],
  title: string,
  location: string,
  totalArea: number,
  totalRooms: number,
  moveInDate: string,
  ofRoomsDiff: string[]
}

type CostsType = {
  ofRunningServices: string[],
  ofAdditionalServices: string[],
  baseRent: number,
  runningCosts: number,
  hotWaterInHeatingCosts: boolean,
  additionalCosts: number,
  ofRunningServicesDiff: string[],
  ofAdditionalServicesDiff: string[]
}

type LandlordType = {
  firstName: string,
  lastName: string,
  phone: string
}

type FormDataType = {
  landlord: LandlordType,
  accommodation: AccommodationType,
  costs: CostsType
}

type OfferType = {
  email: string,
  formData: FormDataType,
  createdDate: string
}

export default new EndpointBuilder(WOHNEN_ENDPOINT_NAME)
  .withParamsToUrlMapper((params): string => {
    if (!params.city) {
      throw new ParamMissingError(WOHNEN_ENDPOINT_NAME, 'city')
    }

    return `https://api.wohnen.integreat-app.de/v0/${params.city}/offer`
  })
  .withMapper((json: Array<OfferType>): Array<WohnenOfferModel> => json
    .map(offer => {
      const landlord = offer.formData.landlord
      const accommodation = offer.formData.accommodation
      const costs = offer.formData.costs
      return new WohnenOfferModel({
        email: offer.email,
        createdDate: moment(offer.createdDate),
        formData: new WohnenFormData(
          {
            firstName: landlord.firstName,
            lastName: landlord.lastName,
            phone: landlord.phone
          },
          {
            ofRooms: accommodation.ofRooms,
            title: accommodation.title,
            location: accommodation.location,
            totalArea: accommodation.totalArea,
            totalRooms: accommodation.totalRooms,
            moveInDate: moment(accommodation.moveInDate),
            ofRoomsDiff: accommodation.ofRoomsDiff
          },
          {
            ofRunningServices: costs.ofRunningServices,
            ofAdditionalServices: costs.ofAdditionalServices,
            baseRent: costs.baseRent,
            runningCosts: costs.runningCosts,
            hotWaterInHeatingCosts: costs.hotWaterInHeatingCosts === 'true',
            additionalCosts: costs.additionalCosts,
            ofRunningServicesDiff: costs.ofRunningServicesDiff,
            ofAdditionalServicesDiff: costs.ofAdditionalServicesDiff
          }),
        formDataType: WohnenFormData
      })
    }))
  .build()
