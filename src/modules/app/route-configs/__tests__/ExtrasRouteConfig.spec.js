// @flow

import ExtrasRouteConfig from '../ExtrasRouteConfig'
import { ExtraModel, Payload } from '@integreat-app/integreat-api-client'
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
const extrasPayload = new Payload(false, 'https://random.api.json', extras, null)
const payloads = { extras: extrasPayload }

const t = (key: ?string): string => key || ''

describe('ExtrasRouteConfig', () => {
  const extasRouteConfig = new ExtrasRouteConfig()

  it('should get the right path', () => {
    expect(extasRouteConfig.getRoutePath({ city: 'augsburg', language: 'de' })).toBe('/augsburg/de/extras')
  })

  it('should get the required payloads', () => {
    const allPayloads = {
      extrasPayload,
      citiesPayload: new Payload(true),
      categoriesPayload: new Payload(true),
      disclaimerPayload: new Payload(true),
      eventsPayload: new Payload(true),
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
    expect(extasRouteConfig.getPageTitle({ payloads, location, cityName: null, t }))
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
