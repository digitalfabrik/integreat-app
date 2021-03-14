// @flow

import SprungbrettRouteConfig from '../SprungbrettRouteConfig'
import { OfferModel, Payload, SprungbrettJobModel } from 'api-client'
import createLocation from '../../../../createLocation'

const offers = [
  new OfferModel({
    alias: 'sprungbrett',
    path: 'path to fetch jobs from',
    title: 'Sprungbrett',
    thumbnail: 'xy',
    postData: null
  })
]
const offersPayload = new Payload(false, 'https://random.api.json', offers, null)

const sprungbrettJobs = [
  new SprungbrettJobModel({
    id: 0,
    title: 'WebDeveloper',
    location: 'Augsburg',
    isEmployment: true,
    isApprenticeship: true,
    url: 'http://awesome-jobs.domain'
  })
]
const sprungbrettJobsPayload = new Payload(false, 'https://random.api.json', sprungbrettJobs, null)
const payloads = { offers: offersPayload, sprungbrettJobs: sprungbrettJobsPayload }

const t = (key: ?string): string => key || ''

describe('SprungbrettRouteConfig', () => {
  const sprungbrettRouteConfig = new SprungbrettRouteConfig()

  it('should get the right path', () => {
    expect(sprungbrettRouteConfig.getRoutePath({ city: 'augsburg', language: 'de' })).toBe(
      '/augsburg/de/offers/sprungbrett'
    )
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
      wohnenOffersPayload: new Payload(true),
      sprungbrettJobsPayload
    }

    expect(sprungbrettRouteConfig.getRequiredPayloads(allPayloads)).toEqual(payloads)
  })

  it('should get the right language change path', () => {
    const location = createLocation({
      payload: { city: 'augsburg', language: 'de' },
      pathname: '/augsburg/de/offers/sprungbrett',
      type: sprungbrettRouteConfig.name
    })

    expect(sprungbrettRouteConfig.getLanguageChangePath({ payloads, language: 'en', location })).toBe(
      '/augsburg/en/offers/sprungbrett'
    )
    expect(sprungbrettRouteConfig.getLanguageChangePath({ payloads, language: 'ar', location })).toBe(
      '/augsburg/ar/offers/sprungbrett'
    )
  })

  it('should get the right page title', () => {
    const location = createLocation({
      payload: { city: 'augsburg', language: 'de' },
      pathname: '/augsburg/de/offers/sprungbrett',
      type: sprungbrettRouteConfig.name
    })

    expect(sprungbrettRouteConfig.getPageTitle({ payloads, location, cityName: 'Augsburg', t })).toBe(
      'Sprungbrett - Augsburg'
    )
    expect(sprungbrettRouteConfig.getPageTitle({ payloads, location, cityName: null, t })).toBeNull()
  })

  it('should return the right meta description', () => {
    expect(sprungbrettRouteConfig.getMetaDescription(t)).toBeNull()
  })

  it('should return the right feedback target information', () => {
    const location = createLocation({
      payload: { city: 'augsburg', language: 'de' },
      pathname: '/augsburg/de/offers/sprungbrett',
      type: sprungbrettRouteConfig.name
    })

    expect(sprungbrettRouteConfig.getFeedbackTargetInformation({ payloads, location })).toEqual({
      alias: 'sprungbrett',
      title: 'Sprungbrett'
    })
  })
})
