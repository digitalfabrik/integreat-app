// @flow

import React from 'react'
import { WohnenOfferModel, WohnenFormData } from 'api-client'
import moment from 'moment'
import { shallow } from 'enzyme'
import OfferListItem from '../OfferListItem'

describe('OfferListItem', () => {
  const offer = new WohnenOfferModel({
    email: 'mail@mail.com',
    createdDate: moment('2018-07-24T00:00:00.000Z'),
    formDataType: WohnenFormData,
    formData: new WohnenFormData(
      {
        firstName: 'Max',
        lastName: 'Ammann',
        phone: ''
      },
      {
        ofRooms: ['kitchen', 'child2', 'child1', 'bed'],
        title: 'Test Angebot',
        location: 'Augsburg',
        totalArea: 120,
        totalRooms: 4,
        moveInDate: moment('2018-07-19T15:35:12.000Z'),
        ofRoomsDiff: ['bath', 'wc', 'child3', 'livingroom', 'hallway', 'store', 'basement', 'balcony']
      },
      {
        ofRunningServices: ['chimney', 'other'],
        ofAdditionalServices: ['garage'],
        baseRent: 1000,
        runningCosts: 1200,
        hotWaterInHeatingCosts: true,
        additionalCosts: 200,
        ofRunningServicesDiff: ['heating', 'water', 'garbage'],
        ofAdditionalServicesDiff: []
      }
    )
  })

  const language = 'de'
  const city = 'Augsburg'

  const hash = (offer: WohnenOfferModel) => offer.email

  it('should render and match snapshot', () => {
    expect(
      shallow(<OfferListItem offer={offer} language={language} city={city} hashFunction={hash} />)
    ).toMatchSnapshot()
  })
})
