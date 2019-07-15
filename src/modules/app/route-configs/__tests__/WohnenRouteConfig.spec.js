// @flow

import WohnenRouteConfig, { hash } from '../WohnenRouteConfig'
import { ExtraModel, Payload, WohnenFormData, WohnenOfferModel } from '@integreat-app/integreat-api-client'
import createLocation from '../../../../createLocation'
import moment from 'moment'

const extras = [
  new ExtraModel({
    alias: 'wohnen', path: 'path to fetch offers from', title: 'Raumfrei', thumbnail: 'xy', postData: null
  })
]
const extrasPayload = new Payload(false, 'https://random.api.json', extras, null)

const offers = [
  new WohnenOfferModel({
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
]
const wohnenPayload = new Payload(false, 'https://random.api.json', offers, null)
const payloads = { extras: extrasPayload, offers: wohnenPayload }

const t = (key: ?string): string => key || ''

describe('WohnenRouteConfig', () => {
  const wohnenRouteConfig = new WohnenRouteConfig()

  it('should get the right path', () => {
    expect(wohnenRouteConfig.getRoutePath({ city: 'augsburg', language: 'de' }))
      .toBe('/augsburg/de/extras/wohnen')
  })

  it('should get the required payloads', () => {
    const allPayloads = {
      extrasPayload,
      citiesPayload: new Payload(true),
      categoriesPayload: new Payload(true),
      disclaimerPayload: new Payload(true),
      eventsPayload: new Payload(true),
      poisPayload: new Payload(true),
      wohnenPayload,
      sprungbrettJobsPayload: new Payload(true)
    }

    expect(wohnenRouteConfig.getRequiredPayloads(allPayloads)).toEqual(payloads)
  })

  it('should get the right language change path', () => {
    const location = createLocation({
      payload: { city: 'augsburg', language: 'de' },
      pathname: '/augsburg/de/extras/wohnen',
      type: wohnenRouteConfig.name
    })

    expect(wohnenRouteConfig.getLanguageChangePath({ payloads, language: 'en', location }))
      .toBe('/augsburg/en/extras/wohnen')
    expect(wohnenRouteConfig.getLanguageChangePath({ payloads, language: 'ar', location }))
      .toBe('/augsburg/ar/extras/wohnen')
  })

  it('should get the right page title', () => {
    const location = createLocation({
      payload: { city: 'augsburg', language: 'de' },
      pathname: '/augsburg/de/extras/wohnen',
      type: wohnenRouteConfig.name
    })

    expect(wohnenRouteConfig.getPageTitle({ payloads, location, cityName: 'Augsburg', t }))
      .toBe('Raumfrei - Augsburg')

    const offerLocation = createLocation({
      payload: { city: 'augsburg', language: 'de', offerHash: hash(offers[0]) },
      pathname: `/augsburg/de/extras/wohnen/${hash(offers[0])}`,
      type: wohnenRouteConfig.name
    })

    expect(wohnenRouteConfig.getPageTitle({ payloads, location: offerLocation, cityName: 'Augsburg', t }))
      .toBe('Test Angebot - Augsburg')

    expect(wohnenRouteConfig.getPageTitle({ payloads, location, cityName: null, t }))
      .toBeNull()
  })

  it('should return the right meta description', () => {
    expect(wohnenRouteConfig.getMetaDescription(t)).toBeNull()
  })

  it('should return the right feedback target information', () => {
    const location = createLocation({
      payload: { city: 'augsburg', language: 'de' },
      pathname: '/augsburg/de/extras/wohnen',
      type: wohnenRouteConfig.name
    })

    expect(wohnenRouteConfig.getFeedbackTargetInformation({ payloads, location }))
      .toEqual({
        alias: 'wohnen',
        title: 'Raumfrei'
      })
  })
})
