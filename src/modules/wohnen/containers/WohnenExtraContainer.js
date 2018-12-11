// @flow

import type { StateType } from '../../app/StateType'
import compose from 'lodash/fp/compose'
import connect from 'react-redux/es/connect/connect'
import { translate } from 'react-i18next'
import WohnenExtra from '../components/WohnenExtra'

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
  }]
  const offers = [
    {
      'email': 'erika@mustermann.de',
      'createdDate': '2018-05-27T11:19:49.185Z',
      'formData': {
        'landlord': {
          'surname': 'Mustermann',
          'firstName': 'Erika',
          'phone': '12342345346'
        },
        'object': {
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
  ]

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
