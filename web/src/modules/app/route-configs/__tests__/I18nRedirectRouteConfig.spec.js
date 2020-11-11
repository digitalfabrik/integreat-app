// @flow

import I18nRedirectRouteConfig from '../I18nRedirectRouteConfig'
import { CityModel, Payload } from 'api-client'
import createLocation from '../../../../createLocation'

const cities = [
  new CityModel({
    name: 'Mambo No. 5',
    code: 'city1',
    live: true,
    eventsEnabled: true,
    offersEnabled: false,
    tunewsEnabled: false,
    pushNotificationsEnabled: false,
    sortingName: 'Mambo',
    aliases: null,
    longitude: null,
    latitude: null,
    prefix: null
  })
]
const citiesPayload = new Payload(false, 'https://random.api.json', cities, null)
const payloads = { cities: citiesPayload }

const t = (key: ?string): string => key || ''

describe('I18nRedirectRouteConfig', () => {
  const i18nRedirectRouteConfig = new I18nRedirectRouteConfig()

  it('should get the right path', () => {
    expect(i18nRedirectRouteConfig.getRoutePath({ param: 'param' })).toBe('/param')
    expect(i18nRedirectRouteConfig.getRoutePath({})).toBe('/')
  })

  it('should get the required payloads', () => {
    const allPayloads = {
      categoriesPayload: new Payload(false),
      citiesPayload,
      eventsPayload: new Payload(true),
      localNewsPayload: new Payload(true),
      localNewsElementPayload: new Payload(true),
      tunewsPayload: new Payload(true),
      tunewsLanguagesPayload: new Payload(true),
      tunewsElementPayload: new Payload(true),
      disclaimerPayload: new Payload(true),
      offersPayload: new Payload(true),
      poisPayload: new Payload(true),
      wohnenOffersPayload: new Payload(true),
      sprungbrettJobsPayload: new Payload(true)
    }

    expect(i18nRedirectRouteConfig.getRequiredPayloads(allPayloads)).toEqual(payloads)
  })

  it('all functions should return null', () => {
    const location = createLocation({
      payload: { param: 'param' },
      pathname: '/param',
      type: i18nRedirectRouteConfig.name
    })
    expect(i18nRedirectRouteConfig.getPageTitle({ t, payloads, location, cityName: null })).toBeNull()
    expect(i18nRedirectRouteConfig.getLanguageChangePath({ payloads, location, language: 'de' })).toBeNull()
    expect(i18nRedirectRouteConfig.getMetaDescription({ t })).toBeNull()
    expect(i18nRedirectRouteConfig.getFeedbackTargetInformation({ payloads, location })).toBeNull()
  })
})
