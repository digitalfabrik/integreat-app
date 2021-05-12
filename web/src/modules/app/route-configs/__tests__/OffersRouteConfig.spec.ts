// @flow

import OffersRouteConfig from '../OffersRouteConfig'
import { OfferModel, Payload } from 'api-client'
import createLocation from '../../../../createLocation'
import CityModelBuilder from 'api-client/src/testing/CityModelBuilder'

const offers = [
  new OfferModel({
    alias: 'ihk-praktikumsboerse',
    path: 'ihk-pratkitkumsboerse.com',
    title: 'Praktikumsboerse',
    thumbnail: 'xy',
    postData: null
  })
]
const cities = new CityModelBuilder(1).build()
const offersPayload = new Payload(false, 'https://random.api.json', offers, null)
const citiesPayload = new Payload(false, 'https://random.api.json', cities, null)
const payloads = { offers: offersPayload, cities: citiesPayload }

const t = (key: ?string): string => key || ''

describe('OffersRouteConfig', () => {
  const extasRouteConfig = new OffersRouteConfig()

  it('should get the right path', () => {
    expect(extasRouteConfig.getRoutePath({ city: 'augsburg', language: 'de' })).toBe('/augsburg/de/offers')
  })

  it('should get the required payloads', () => {
    const allPayloads = {
      offersPayload,
      citiesPayload,
      categoriesPayload: new Payload(true),
      disclaimerPayload: new Payload(true),
      eventsPayload: new Payload(true),
      localNewsPayload: new Payload(true),
      localNewsElementPayload: new Payload(true),
      tunewsPayload: new Payload(true),
      tunewsLanguagesPayload: new Payload(true),
      tunewsElementPayload: new Payload(true),
      poisPayload: new Payload(true),
      wohnenOffersPayload: new Payload(true),
      sprungbrettJobsPayload: new Payload(true)
    }

    expect(extasRouteConfig.getRequiredPayloads(allPayloads)).toEqual(payloads)
  })

  it('should get the right language change path', () => {
    const location = createLocation({
      payload: { city: 'augsburg', language: 'de' },
      pathname: '/augsburg/de/offers',
      type: extasRouteConfig.name
    })

    expect(extasRouteConfig.getLanguageChangePath({ payloads, language: 'en', location })).toBe('/augsburg/en/offers')
    expect(extasRouteConfig.getLanguageChangePath({ payloads, language: 'ar', location })).toBe('/augsburg/ar/offers')
  })

  it('should get the right page title', () => {
    const location = createLocation({
      payload: { city: 'augsburg', language: 'de' },
      pathname: '/augsburg/de/offers',
      type: extasRouteConfig.name
    })

    expect(extasRouteConfig.getPageTitle({ payloads, location, cityName: 'Augsburg', t })).toBe(
      'pageTitles.offers - Stadt Augsburg'
    )

    const wrongLocation = createLocation({
      payload: { city: 'wrong-location', language: 'de' },
      pathname: '/wrong-location/de/offers',
      type: extasRouteConfig.name
    })
    expect(extasRouteConfig.getPageTitle({ payloads, cityName: null, location: wrongLocation, t })).toBeNull()
  })

  it('should return the right meta description', () => {
    expect(extasRouteConfig.getMetaDescription(t)).toBeNull()
  })

  it('should return the right feedback target information', () => {
    const location = createLocation({
      payload: { city: 'augsburg', language: 'de' },
      pathname: '/augsburg/de/offers',
      type: extasRouteConfig.name
    })

    expect(extasRouteConfig.getFeedbackTargetInformation({ payloads, location })).toBeNull()
  })
})
