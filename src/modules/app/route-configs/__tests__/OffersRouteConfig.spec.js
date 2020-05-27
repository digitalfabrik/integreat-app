// @flow

import OffersRouteConfig from '../OffersRouteConfig'
import { OfferModel, Payload } from '@integreat-app/integreat-api-client'
import createLocation from '../../../../createLocation'

const offers = [
  new OfferModel({
    alias: 'ihk-praktikumsboerse',
    path: 'ihk-pratkitkumsboerse.com',
    title: 'Praktikumsboerse',
    thumbnail: 'xy',
    postData: null
  })
]
const offersPayload = new Payload(false, 'https://random.api.json', offers, null)
const payloads = { offers: offersPayload }

const t = (key: ?string): string => key || ''

describe('OffersRouteConfig', () => {
  const extasRouteConfig = new OffersRouteConfig()

  it('should get the right path', () => {
    expect(extasRouteConfig.getRoutePath({ city: 'augsburg', language: 'de' })).toBe('/augsburg/de/offers')
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
      tunewsElementPayload: new Payload(true),
      poisPayload: new Payload(true),
      wohnenPayload: new Payload(true),
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

    expect(extasRouteConfig.getLanguageChangePath({ payloads, language: 'en', location }))
      .toBe('/augsburg/en/offers')
    expect(extasRouteConfig.getLanguageChangePath({ payloads, language: 'ar', location }))
      .toBe('/augsburg/ar/offers')
  })

  it('should get the right page title', () => {
    const location = createLocation({
      payload: { city: 'augsburg', language: 'de' },
      pathname: '/augsburg/de/offers',
      type: extasRouteConfig.name
    })

    expect(extasRouteConfig.getPageTitle({ payloads, location, cityName: 'Augsburg', t }))
      .toBe('pageTitles.extras - Augsburg')
    expect(extasRouteConfig.getPageTitle({ payloads, location, cityName: null, t }))
      .toBeNull()
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

    expect(extasRouteConfig.getFeedbackTargetInformation({ payloads, location }))
      .toBeNull()
  })
})
