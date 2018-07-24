// @flow

import { shallow } from 'enzyme'
import React from 'react'

import ExtraModel from 'modules/endpoint/models/ExtraModel'
import ConnectedWohnenExtraPage, { WohnenExtraPage } from '../WohnenExtraPage'
import configureMockStore from 'redux-mock-store'
import CityModel from 'modules/endpoint/models/CityModel'
import WohnenOfferModel from 'modules/endpoint/models/WohnenOfferModel'
import moment from 'moment'
import WohnenFormData from 'modules/endpoint/models/WohnenFormData'
import Hashids from 'hashids'
import Payload from 'modules/endpoint/Payload'

describe('WohnenExtraPage', () => {
  const city = 'augsburg'
  const language = 'de'

  const wohnenExtra = new ExtraModel({
    alias: 'wohnen', path: 'path to fetch offers from', title: 'Raumfrei', thumbnail: 'xy'
  })

  const extras = [wohnenExtra]

  const cities = [
    new CityModel({
      name: 'Augsburg',
      code: 'augsburg',
      live: true,
      eventsEnabled: true,
      extrasEnabled: false,
      sortingName: 'Augsburg'
    })
  ]

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
      })
  })
  const offerHash = new Hashids().encode(offer.email.length, offer.createdDate.milliseconds())

  const offers = [offer]

  it('should render list if no hash is supplied', () => {
    const wohnenPage = shallow(
      <WohnenExtraPage offers={offers}
                       city={city}
                       language={language}
                       extras={[wohnenExtra]}
                       cities={cities} />
    )
    expect(wohnenPage).toMatchSnapshot()
  })

  it('should render detailed offer if hash is supplied', () => {
    const wohnenPage = shallow(
      <WohnenExtraPage offers={offers}
                       city={city}
                       language={language}
                       offerHash={offerHash}
                       extras={[wohnenExtra]}
                       cities={cities} />
    )
    expect(wohnenPage).toMatchSnapshot()
  })

  it('should render failure offer if offer is not found', () => {
    const extrasPage = shallow(
      <WohnenExtraPage offers={offers}
                       city={city}
                       language={language}
                       offerHash={'invalid hash'}
                       extras={[wohnenExtra]}
                       cities={cities} />
    )
    expect(extrasPage).toMatchSnapshot()
  })

  it('should render failure city does not support offer', () => {
    const wohnenPage = shallow(
      <WohnenExtraPage offers={offers}
                       city={city}
                       language={language}
                       offerHash={offerHash}
                       extras={[]}
                       cities={cities} />
    )
    expect(wohnenPage).toMatchSnapshot()
  })

  it('should render spinner if offers are not ready', () => {
    const wohnenPage = shallow(
      <WohnenExtraPage offers={null}
                       city={city}
                       language={language}
                       offerHash={offerHash}
                       extras={[wohnenExtra]}
                       cities={cities} />
    )
    expect(wohnenPage).toMatchSnapshot()
  })

  it('should map state to props', () => {
    const offerHash = 'hASH'
    const location = {payload: {language, city, offerHash}}

    const mockStore = configureMockStore()
    const store = mockStore({
      location: location,
      extras: new Payload(false, null, extras),
      wohnen: new Payload(false, null, offers),
      cities: new Payload(false, null, cities)
    })

    const wohnenPage = shallow(
      <ConnectedWohnenExtraPage store={store} />
    )

    expect(wohnenPage.props()).toMatchObject({
      language,
      city,
      offerHash,
      extras,
      cities,
      offers
    })
  })
})
