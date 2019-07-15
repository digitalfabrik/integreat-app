// @flow

import LandingRouteConfig from '../LandingRouteConfig'
import { CityModel, Payload } from '@integreat-app/integreat-api-client'
import createLocation from '../../../../createLocation'

const cities = [
  new CityModel({
    name: 'Mambo No. 5',
    code: 'city1',
    live: true,
    eventsEnabled: true,
    extrasEnabled: false,
    sortingName: 'Mambo'
  })
]
const citiesPayload = new Payload(false, 'https://random.api.json', cities, null)
const payloads = { cities: citiesPayload }

const t = (key: ?string): string => key || ''

describe('LandingRouteConfig', () => {
  const landingRouteConfig = new LandingRouteConfig()

  it('should get the right path', () => {
    expect(landingRouteConfig.getRoutePath({ language: 'de' })).toBe('/landing/de')
  })

  it('should get the required payloads', () => {
    const allPayloads = {
      categoriesPayload: new Payload(false),
      citiesPayload,
      eventsPayload: new Payload(true),
      disclaimerPayload: new Payload(true),
      extrasPayload: new Payload(true),
      poisPayload: new Payload(true),
      wohnenPayload: new Payload(true),
      sprungbrettJobsPayload: new Payload(true)
    }

    expect(landingRouteConfig.getRequiredPayloads(allPayloads)).toEqual(payloads)
  })

  it('should return the right page title', () => {
    const location = createLocation({
      payload: { language: 'de' },
      pathname: '/landing/de',
      type: landingRouteConfig.name
    })
    expect(landingRouteConfig.getPageTitle({ t, payloads, location, cityName: null }))
      .toBe('pageTitles.landing')
  })

  it('should return the right meta description', () => {
    expect(landingRouteConfig.getMetaDescription(t))
      .toBe('metaDescription')
  })

  it('should return the right language change path', () => {
    const location = createLocation({
      payload: { language: 'de' },
      pathname: '/landing/de',
      type: landingRouteConfig.name
    })
    expect(landingRouteConfig.getLanguageChangePath({ payloads, location, language: 'de' })).toBeNull()
  })

  it('all functions should return the right feedback target information', () => {
    const location = createLocation({
      payload: { language: 'de' },
      pathname: '/landing/de',
      type: landingRouteConfig.name
    })
    expect(landingRouteConfig.getFeedbackTargetInformation({ payloads, location })).toBeNull()
  })
})
