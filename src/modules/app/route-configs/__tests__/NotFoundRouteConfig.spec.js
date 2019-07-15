// @flow

import NotFoundRouteConfig from '../NotFoundRouteConfig'
import { Payload } from '@integreat-app/integreat-api-client'
import createLocation from '../../../../createLocation'
import { NOT_FOUND } from 'redux-first-router'

const t = (key: ?string): string => key || ''

describe('NotFoundRouteConfig', () => {
  const notFoundRouteConfig = new NotFoundRouteConfig()

  it('should get the right path', () => {
    expect(notFoundRouteConfig.getRoutePath()).toBe(NOT_FOUND)
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

    expect(notFoundRouteConfig.getRequiredPayloads(allPayloads)).toBeUndefined()
  })

  it('should return the right page title', () => {
    const location = createLocation({
      payload: {},
      pathname: NOT_FOUND,
      type: notFoundRouteConfig.name
    })
    expect(notFoundRouteConfig.getPageTitle({ t, payloads: undefined, location, cityName: null }))
      .toBe('pageTitles.notFound')
  })

  it('should return the right meta description', () => {
    expect(notFoundRouteConfig.getMetaDescription(t)).toBeNull()
  })

  it('should return the right language change path', () => {
    const location = createLocation({
      payload: { language: 'de' },
      pathname: NOT_FOUND,
      type: notFoundRouteConfig.name
    })
    expect(notFoundRouteConfig.getLanguageChangePath({ payloads: undefined, location, language: 'de' })).toBeNull()
  })

  it('all functions should return the right feedback target information', () => {
    const location = createLocation({
      payload: { language: 'de' },
      pathname: NOT_FOUND,
      type: notFoundRouteConfig.name
    })
    expect(notFoundRouteConfig.getFeedbackTargetInformation({ payloads: undefined, location })).toBeNull()
  })
})
