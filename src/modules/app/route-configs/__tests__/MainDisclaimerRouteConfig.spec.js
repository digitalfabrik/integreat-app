// @flow

import MainDisclaimerRouteConfig from '../MainDisclaimerRouteConfig'
import { Payload } from '@integreat-app/integreat-api-client'
import createLocation from '../../../../createLocation'

const t = (key: ?string): string => key || ''

describe('MainDisclaimerRouteConfig', () => {
  const mainDisclaimerRouteConfig = new MainDisclaimerRouteConfig()

  it('should get the right path', () => {
    expect(mainDisclaimerRouteConfig.getRoutePath()).toBe('/disclaimer')
  })

  it('should get the required payloads', () => {
    const allPayloads = {
      categoriesPayload: new Payload(false),
      citiesPayload: new Payload(false),
      eventsPayload: new Payload(true),
      disclaimerPayload: new Payload(true),
      extrasPayload: new Payload(true),
      poisPayload: new Payload(true),
      wohnenPayload: new Payload(true),
      sprungbrettJobsPayload: new Payload(true)
    }

    expect(mainDisclaimerRouteConfig.getRequiredPayloads(allPayloads)).toBeUndefined()
  })

  it('should return the right page title', () => {
    const location = createLocation({
      payload: {},
      pathname: '/disclaimer',
      type: mainDisclaimerRouteConfig.name
    })
    expect(mainDisclaimerRouteConfig.getPageTitle({ t, payloads: undefined, location, cityName: null }))
      .toBe('pageTitles.mainDisclaimer')
  })

  it('should return the right meta description', () => {
    expect(mainDisclaimerRouteConfig.getMetaDescription(t)).toBeNull()
  })

  it('should return the right language change path', () => {
    const location = createLocation({
      payload: { language: 'de' },
      pathname: '/disclaimer',
      type: mainDisclaimerRouteConfig.name
    })
    expect(mainDisclaimerRouteConfig.getLanguageChangePath({
      payloads: undefined,
      location,
      language: 'de'
    })).toBeNull()
  })

  it('all functions should return the right feedback target information', () => {
    const location = createLocation({
      payload: { language: 'de' },
      pathname: '/disclaimer',
      type: mainDisclaimerRouteConfig.name
    })
    expect(mainDisclaimerRouteConfig.getFeedbackTargetInformation({ payloads: undefined, location })).toBeNull()
  })
})
