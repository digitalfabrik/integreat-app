// @flow

import { shallow } from 'enzyme'
import React from 'react'
import WohnenOfferModel from 'modules/endpoint/models/WohnenOfferModel'
import moment from 'moment'
import WohnenFormData from 'modules/endpoint/models/WohnenFormData'
import { OfferList } from '../OfferList'

describe('OfferList', () => {
  const mockTranslate = (key: ?string) => key || 'null'

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
        runningCosts: 0,
        hotWaterInHeatingCosts: true,
        additionalCosts: 200,
        ofRunningServicesDiff: ['heating', 'water', 'garbage'],
        ofAdditionalServicesDiff: []
      })
  })

  it('should render offer list', () => {
    const offerList = shallow(
      <OfferList city={'augsburg'} language={'language'} offers={[offer]}
                 hashFunction={offer => offer.email} t={mockTranslate} />
    )
    expect(offerList).toMatchSnapshot()
  })

  it('should render paragraph if offers is empty', () => {
    const offerList = shallow(
      <OfferList city={'augsburg'} language={'language'} offers={[]}
                 hashFunction={offer => offer.email} t={mockTranslate} />
    )
    expect(offerList).toMatchSnapshot()
  })
})
