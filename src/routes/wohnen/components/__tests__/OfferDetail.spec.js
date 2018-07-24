// @flow

import { render, shallow } from 'enzyme'
import React from 'react'
import WohnenOfferModel from 'modules/endpoint/models/WohnenOfferModel'
import moment from 'moment'
import WohnenFormData from 'modules/endpoint/models/WohnenFormData'
import OfferDetail from '../OfferDetail'

describe('OfferDetail', () => {
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

  class InvalidForm {
    test: string
  }

  const notRenderableOffer = new WohnenOfferModel({
    email: 'mail@mail.com',
    createdDate: moment('2018-07-24T00:00:00.000Z'),
    formData: new InvalidForm()
  })

  it('should render detail view', () => {
    const offerDetail = shallow(
      <OfferDetail offer={offer} />
    )
    expect(offerDetail).toMatchSnapshot()
  })

  it('should concat keys correctly', () => {
    const offerDetail = shallow(
      <OfferDetail offer={offer} />
    )

    const concatenated = offerDetail.dive().instance().stringify(['a', 'b', 'c'])
    expect(concatenated).toBe('a, b, c')
  })

  it('should translate keys correctly', () => {
    const offerDetail = shallow(
      <OfferDetail offer={offer} />
    )

    const translated = offerDetail.dive().instance().translate('runningServices', ['a', 'b'])
    expect(translated).toEqual(['wohnen:values.runningServices.a', 'wohnen:values.runningServices.b'])
  })

  it('should format price correctly', () => {
    const offerDetail = shallow(
      <OfferDetail offer={offer} />
    )

    const instance = offerDetail.dive().instance()
    expect(instance.formatMonthlyPrice(0)).toBe('Keine')
    expect(instance.formatMonthlyPrice(42)).toBe('42 € monatlich')
  })

  it('should throw error if form is not renderable', () => {
    expect(() => render(<OfferDetail offer={notRenderableOffer} />)).toThrowErrorMatchingSnapshot()
  })
})
