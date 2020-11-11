// @flow

import EndpointBuilder from '../EndpointBuilder'
import ParamMissingError from '../errors/ParamMissingError'
import WohnenOfferModel from '../models/WohnenOfferModel'
import WohnenFormData from '../models/WohnenFormData'
import moment from 'moment'
import type { OfferType } from '../types'
import Endpoint from '../Endpoint'

export const WOHNEN_ENDPOINT_NAME = 'wohnen'

export const WOHNEN_OFFER = 'wohnen'

type ParamsType = { city: ?string }

export default (baseUrl: string): Endpoint<ParamsType, Array<WohnenOfferModel>> =>
  new EndpointBuilder(WOHNEN_ENDPOINT_NAME)
    .withParamsToUrlMapper((params): string => {
      if (!params.city) {
        throw new ParamMissingError(WOHNEN_ENDPOINT_NAME, 'city')
      }

      return `${baseUrl}/${params.city}/offer`
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
      })
      .sort((model1, model2) => model1.createdDate.isBefore(model2.createdDate) ? 1 : -1))
    .build()
