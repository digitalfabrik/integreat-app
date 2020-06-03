// @flow

import ExtrasRouteConfig from '../ExtrasRouteConfig'
import { CityModel, ExtraModel, Payload } from '@integreat-app/integreat-api-client'
import createLocation from '../../../../createLocation'

const extras = [
  new ExtraModel({
    alias: 'ihk-praktikumsboerse',
    path: 'ihk-pratkitkumsboerse.com',
    title: 'Praktikumsboerse',
    thumbnail: 'xy',
    postData: null
  })
]
const cities = [new CityModel({
  name: 'Augsburg',
  code: 'augsburg',
  live: true,
  eventsEnabled: true,
  extrasEnabled: true,
  pushNotificationsEnabled: true,
  tunewsEnabled: true,
  sortingName: 'Augsburg',
  prefix: null,
  latitude: null,
  longitude: null,
  aliases: null
})]
const extrasPayload = new Payload(false, 'https://random.api.json', extras, null)
const citiesPayload = new Payload(false, 'https://random.api.json', cities, null)
const payloads = { extras: extrasPayload, cities: citiesPayload }

const t = (key: ?string): string => key || ''

describe('ExtrasRouteConfig', () => {
  const extasRouteConfig = new ExtrasRouteConfig()

  it('should get the right path', () => {
    expect(extasRouteConfig.getRoutePath({ city: 'augsburg', language: 'de' })).toBe('/augsburg/de/extras')
  })

  it('should get the required payloads', () => {
    const allPayloads = {
      extrasPayload,
      citiesPayload,
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
      pathname: '/augsburg/de/extras',
      type: extasRouteConfig.name
    })

    expect(extasRouteConfig.getLanguageChangePath({ payloads, language: 'en', location }))
      .toBe('/augsburg/en/extras')
    expect(extasRouteConfig.getLanguageChangePath({ payloads, language: 'ar', location }))
      .toBe('/augsburg/ar/extras')
  })

  it('should get the right page title', () => {
    const location = createLocation({
      payload: { city: 'augsburg', language: 'de' },
      pathname: '/augsburg/de/extras',
      type: extasRouteConfig.name
    })

    expect(extasRouteConfig.getPageTitle({ payloads, location, cityName: 'Augsburg', t }))
      .toBe('pageTitles.extras - Augsburg')

    const wrongLocation = createLocation({
      payload: { city: 'wrong-location', language: 'de' },
      pathname: '/wrong-location/de/extras',
      type: extasRouteConfig.name
    })
    expect(extasRouteConfig.getPageTitle({ payloads, cityName: null, location: wrongLocation, t }))
      .toBeNull()
  })

  it('should return the right meta description', () => {
    expect(extasRouteConfig.getMetaDescription(t)).toBeNull()
  })

  it('should return the right feedback target information', () => {
    const location = createLocation({
      payload: { city: 'augsburg', language: 'de' },
      pathname: '/augsburg/de/extras',
      type: extasRouteConfig.name
    })

    expect(extasRouteConfig.getFeedbackTargetInformation({ payloads, location }))
      .toBeNull()
  })
})
