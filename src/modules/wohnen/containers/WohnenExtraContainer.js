// @flow

import type { StateType } from '../../app/StateType'
import compose from 'lodash/fp/compose'
import connect from 'react-redux/es/connect/connect'
import { translate } from 'react-i18next'
import WohnenExtra from '../components/WohnenExtra'
import moment from 'moment'
import { ExtraModel, WohnenFormData, WohnenOfferModel } from '@integreat-app/integreat-api-client'
import { createPostMap } from '../../extras/containers/ExtrasContainer'

const mapStateTypeToProps = (state: StateType, ownProps) => {
  const language: string = state.language
  const targetCity: string = ownProps.navigation.getParam('city')
  const offerHash: string = ownProps.navigation.getParam('offerHash')

  const navigateToOffer = (offerHash: string) => {
    const params = {offerHash, city: targetCity}
    if (ownProps.navigation.push) {
      ownProps.navigation.push('WohnenExtra', params)
    }
  }

  // MockData:
  const extras = [{
    'alias': 'wohnen',
    'name': 'Raumfrei',
    'url': 'https://raumfrei.neuburg-schrobenhausen.de',
    'post': {'api-name': 'neuburgschrobenhausenwohnraum'},
    'thumbnail': 'https://cms.integreat-app.de/wp-content/uploads/extra-thumbnails/raumfrei.jpg'
  }].map(extra => new ExtraModel({
    alias: extra.alias,
    title: extra.name,
    path: extra.url,
    thumbnail: extra.thumbnail,
    postData: extra.post ? createPostMap(extra.post) : null
  }))

  const offers = [
    {
      'email': 'erika@mustermann.de',
      'createdDate': '2018-05-27T11:19:49.185Z',
      'formData': {
        'landlord': {
          'lastName': 'Mustermann',
          'firstName': 'Erika',
          'phone': '12342345346'
        },
        'accommodation': {
          'title': 'Super flat in city center',
          'location': 'Augsburg',
          'totalArea': 105,
          'totalRooms': 3,
          'ofRooms': ['bath', 'child1'],
          'ofRoomsDiff': ['child2', 'child3', 'bed'],
          'moveInDate': '2018-05-24'
        },
        'costs': {
          'baseRent': 450.30,
          'runningCosts': 30.20,
          'ofRunningServices': ['heating'],
          'ofRunningServicesDiff': ['garbage', 'chimney'],
          'hotWaterInHeatingCosts': true,
          'additionalCosts': 0,
          'ofAdditionalServices': [],
          'ofAdditionalServicesDiff': ['garage', 'other']
        }
      }
    }
  ].map(offer => {
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

  return {
    city: targetCity,
    language: language,
    offers: offers,
    offerHash: offerHash,
    extras: extras,
    navigateToOffer: navigateToOffer
  }
}

export default compose(
  connect(mapStateTypeToProps),
  translate('wohnen')
)(WohnenExtra)
