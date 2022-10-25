import {
  CATEGORIES_ROUTE,
  DASHBOARD_ROUTE,
  DISCLAIMER_ROUTE,
  EVENTS_ROUTE,
  JPAL_TRACKING_ROUTE,
  LANDING_ROUTE,
  LOCAL_NEWS_TYPE,
  NEWS_ROUTE,
  OFFERS_ROUTE,
  POIS_ROUTE,
  SEARCH_ROUTE,
  SPRUNGBRETT_OFFER_ROUTE,
  TU_NEWS_TYPE,
} from '..'

import { cityContentPath, pathnameFromRouteInformation } from '../pathname'

describe('pathname', () => {
  const cityCode = 'augsburg'
  const languageCode = 'de'

  describe('cityContentPath', () => {
    it('should return correct pathname for city content routes with path', () => {
      const pathname = cityContentPath({
        cityCode,
        languageCode,
        route: OFFERS_ROUTE,
        path: SPRUNGBRETT_OFFER_ROUTE,
      })
      expect(pathname).toBe('/augsburg/de/offers/sprungbrett')
    })
    it('should return correct pathname for city content routes without path', () => {
      const pathname = cityContentPath({
        cityCode,
        languageCode,
        route: EVENTS_ROUTE,
      })
      expect(pathname).toBe('/augsburg/de/events')
    })
    it('should return correct pathname for city content routes without route', () => {
      const pathname = cityContentPath({
        cityCode,
        languageCode,
        path: 'willkommen/ankommen',
      })
      expect(pathname).toBe('/augsburg/de/willkommen/ankommen')
    })
    it('should return correct pathname for city content routes without route or path', () => {
      const pathname = cityContentPath({
        cityCode,
        languageCode,
      })
      expect(pathname).toBe('/augsburg/de')
    })
  })
  describe('pathnameFromRouteInformation', () => {
    it('should return right pathname for landing route', () => {
      expect(
        pathnameFromRouteInformation({
          route: LANDING_ROUTE,
          languageCode,
        })
      ).toBe(`/${LANDING_ROUTE}/${languageCode}`)
    })
    it('should match landing route if pathname with tracking code', () => {
      expect(
        pathnameFromRouteInformation({
          route: JPAL_TRACKING_ROUTE,
          trackingCode: 'abcdef12345',
        })
      ).toBe('/jpal')
    })
    it('should match dashboard route if pathname is a city with a language', () => {
      expect(
        pathnameFromRouteInformation({
          route: DASHBOARD_ROUTE,
          languageCode: 'ar',
          cityCode,
          cityContentPath: `/${cityCode}/ar`,
        })
      ).toBe(`/${cityCode}/ar`)
    })
    it('should match events route', () => {
      expect(
        pathnameFromRouteInformation({
          route: EVENTS_ROUTE,
          languageCode,
          cityCode,
        })
      ).toBe(`/${cityCode}/${languageCode}/${EVENTS_ROUTE}`)
    })
    it('should match single events route', () => {
      const pathname = `/${cityCode}/${languageCode}/${EVENTS_ROUTE}/1234`
      expect(
        pathnameFromRouteInformation({
          route: EVENTS_ROUTE,
          languageCode,
          cityCode,
          slug: '1234',
        })
      ).toBe(pathname)
    })
    it('should match pois route', () => {
      expect(
        pathnameFromRouteInformation({
          route: POIS_ROUTE,
          languageCode,
          cityCode,
        })
      ).toBe(`/${cityCode}/${languageCode}/${POIS_ROUTE}`)
    })
    it('should match single pois route', () => {
      const slug = 'tuer-an-tuer'
      const pathname = `/${cityCode}/${languageCode}/${POIS_ROUTE}?name=${slug}`
      expect(
        pathnameFromRouteInformation({
          route: POIS_ROUTE,
          languageCode,
          cityCode,
          slug,
        })
      ).toBe(pathname)
    })
    it('should match disclaimer route', () => {
      expect(
        pathnameFromRouteInformation({
          route: DISCLAIMER_ROUTE,
          languageCode,
          cityCode,
        })
      ).toBe(`/${cityCode}/${languageCode}/${DISCLAIMER_ROUTE}`)
    })
    it('should match offers route', () => {
      expect(
        pathnameFromRouteInformation({
          route: OFFERS_ROUTE,
          languageCode,
          cityCode,
        })
      ).toBe(`/${cityCode}/${languageCode}/${OFFERS_ROUTE}`)
    })
    it('should match sprungbrett offers route', () => {
      expect(
        pathnameFromRouteInformation({
          route: SPRUNGBRETT_OFFER_ROUTE,
          languageCode,
          cityCode,
        })
      ).toBe(`/${cityCode}/${languageCode}/${OFFERS_ROUTE}/${SPRUNGBRETT_OFFER_ROUTE}`)
    })
    it('should match search route', () => {
      expect(
        pathnameFromRouteInformation({
          route: SEARCH_ROUTE,
          languageCode,
          cityCode,
        })
      ).toBe(`/${cityCode}/${languageCode}/${SEARCH_ROUTE}`)
    })
    it('should match local news route', () => {
      expect(
        pathnameFromRouteInformation({
          route: NEWS_ROUTE,
          newsType: LOCAL_NEWS_TYPE,
          newsId: undefined,
          languageCode,
          cityCode,
        })
      ).toBe(`/${cityCode}/${languageCode}/${NEWS_ROUTE}/${LOCAL_NEWS_TYPE}`)
    })
    it('should match single local news route', () => {
      expect(
        pathnameFromRouteInformation({
          route: NEWS_ROUTE,
          newsType: LOCAL_NEWS_TYPE,
          newsId: '1234',
          languageCode,
          cityCode,
        })
      ).toBe(`/${cityCode}/${languageCode}/${NEWS_ROUTE}/${LOCAL_NEWS_TYPE}/1234`)
    })
    it('should match tunews route', () => {
      expect(
        pathnameFromRouteInformation({
          route: NEWS_ROUTE,
          newsType: TU_NEWS_TYPE,
          newsId: undefined,
          languageCode,
          cityCode,
        })
      ).toBe(`/${cityCode}/${languageCode}/${NEWS_ROUTE}/${TU_NEWS_TYPE}`)
    })
    it('should match single tunews route', () => {
      expect(
        pathnameFromRouteInformation({
          route: NEWS_ROUTE,
          newsType: TU_NEWS_TYPE,
          newsId: '1234',
          languageCode,
          cityCode,
        })
      ).toBe(`/${cityCode}/${languageCode}/${NEWS_ROUTE}/${TU_NEWS_TYPE}/1234`)
    })
    it('should match categories route', () => {
      const pathname = `/${cityCode}/${languageCode}/my/custom/category`
      expect(
        pathnameFromRouteInformation({
          route: CATEGORIES_ROUTE,
          languageCode,
          cityCode,
          cityContentPath: pathname,
        })
      ).toBe(pathname)
    })
  })
})
