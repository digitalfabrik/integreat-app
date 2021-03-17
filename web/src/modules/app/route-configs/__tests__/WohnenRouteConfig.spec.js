// @flow

import WohnenRouteConfig, { hash } from '../WohnenRouteConfig'
import { OfferModel, Payload, WohnenFormData, WohnenOfferModel } from 'api-client'
import createLocation from '../../../../createLocation'
import moment from 'moment'

const offers = [
  new OfferModel({
    alias: 'wohnen',
    path: 'path to fetch offers from',
    title: 'Raumfrei',
    thumbnail: 'xy',
    postData: null
  })
]
const offersPayload = new Payload(false, 'https://random.api.json', offers, null)

const wohnenOffers = [
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
      }
    )
  })
]
const wohnenOffersPayload = new Payload(false, 'https://random.api.json', wohnenOffers, null)
const payloads = { offers: offersPayload, wohnenOffers: wohnenOffersPayload }

const t = (key: ?string): string => key || ''

describe('WohnenRouteConfig', () => {
  const wohnenRouteConfig = new WohnenRouteConfig()

  it('should get the right path', () => {
    expect(wohnenRouteConfig.getRoutePath({ city: 'augsburg', language: 'de' })).toBe('/augsburg/de/offers/wohnen')
  })

  it('should get the required payloads', () => {
    const allPayloads = {
      offersPayload,
      citiesPayload: new Payload(true),
      categoriesPayload: new Payload(true),
      disclaimerPayload: new Payload(true),
      eventsPayload: new Payload(true),
      localNewsPayload: new Payload(true),
      localNewsElementPayload: new Payload(true),
      tunewsPayload: new Payload(true),
      tunewsLanguagesPayload: new Payload(true),
      tunewsElementPayload: new Payload(true),
      poisPayload: new Payload(true),
      wohnenOffersPayload,
      sprungbrettJobsPayload: new Payload(true)
    }

    expect(wohnenRouteConfig.getRequiredPayloads(allPayloads)).toEqual(payloads)
  })

  it('should get the right language change path', () => {
    const location = createLocation({
      payload: { city: 'augsburg', language: 'de' },
      pathname: '/augsburg/de/offers/wohnen',
      type: wohnenRouteConfig.name
    })

    expect(wohnenRouteConfig.getLanguageChangePath({ payloads, language: 'en', location })).toBe(
      '/augsburg/en/offers/wohnen'
    )
    expect(wohnenRouteConfig.getLanguageChangePath({ payloads, language: 'ar', location })).toBe(
      '/augsburg/ar/offers/wohnen'
    )
  })

  it('should get the right page title', () => {
    const location = createLocation({
      payload: { city: 'augsburg', language: 'de' },
      pathname: '/augsburg/de/offers/wohnen',
      type: wohnenRouteConfig.name
    })

    expect(wohnenRouteConfig.getPageTitle({ payloads, location, cityName: 'Augsburg', t })).toBe('Raumfrei - Augsburg')

    const offerLocation = createLocation({
      payload: { city: 'augsburg', language: 'de', offerHash: hash(wohnenOffers[0]) },
      pathname: `/augsburg/de/offers/wohnen/${hash(wohnenOffers[0])}`,
      type: wohnenRouteConfig.name
    })

    expect(wohnenRouteConfig.getPageTitle({ payloads, location: offerLocation, cityName: 'Augsburg', t })).toBe(
      'Test Angebot - Augsburg'
    )

    expect(wohnenRouteConfig.getPageTitle({ payloads, location, cityName: null, t })).toBeNull()
  })

  it('should return the right meta description', () => {
    expect(wohnenRouteConfig.getMetaDescription(t)).toBeNull()
  })

  it('should return the right feedback target information', () => {
    const location = createLocation({
      payload: { city: 'augsburg', language: 'de' },
      pathname: '/augsburg/de/offers/wohnen',
      type: wohnenRouteConfig.name
    })

    expect(wohnenRouteConfig.getFeedbackTargetInformation({ payloads, location })).toEqual({
      alias: 'wohnen',
      title: 'Raumfrei'
    })
  })
})
