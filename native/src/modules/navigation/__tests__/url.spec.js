// @flow

import { cityContentPath, urlFromRouteInformation } from '../url'
import {
  CATEGORIES_ROUTE,
  DASHBOARD_ROUTE, DISCLAIMER_ROUTE,
  EVENTS_ROUTE,
  JPAL_TRACKING_ROUTE,
  LANDING_ROUTE, LOCAL_NEWS_TYPE, NEWS_ROUTE,
  OFFERS_ROUTE, POIS_ROUTE, SEARCH_ROUTE,
  SPRUNGBRETT_OFFER_ROUTE, TU_NEWS_TYPE
} from 'api-client'
import InternalPathnameParser from 'api-client/src/routes/InternalPathnameParser'

describe('url', () => {
  const cityCode = 'augsburg'
  const languageCode = 'de'

  describe('cityContentPath', () => {
    it('should return correct pathname for city content routes with path', () => {
      const pathname = cityContentPath({ cityCode, languageCode, route: OFFERS_ROUTE, path: SPRUNGBRETT_OFFER_ROUTE })
      expect(pathname).toBe('/augsburg/de/offers/sprungbrett')
    })

    it('should return correct pathname for city content routes without path', () => {
      const pathname = cityContentPath({ cityCode, languageCode, route: EVENTS_ROUTE })
      expect(pathname).toBe('/augsburg/de/events')
    })

    it('should return correct pathname for city content routes without route', () => {
      const pathname = cityContentPath({ cityCode, languageCode, path: 'willkommen/ankommen' })
      expect(pathname).toBe('/augsburg/de/willkommen/ankommen')
    })

    it('should return correct pathname for city content routes without route or path', () => {
      const pathname = cityContentPath({ cityCode, languageCode })
      expect(pathname).toBe('/augsburg/de')
    })
  })


  describe('urlFromRouteInformation', () => {
    it('should return right url for landing route', () => {
      expect(urlFromRouteInformation({ route: LANDING_ROUTE, languageCode })).toBe(`https://integreat.app`)
    })

    it('should match landing route if pathname with tracking code', () => {
      expect(urlFromRouteInformation({ route: JPAL_TRACKING_ROUTE, trackingCode: 'abcdef12345' })).toBe(`https://integreat.app/jpal`)
    })

    it('should match dashboard route if pathname is a city with a language', () => {
      expect(urlFromRouteInformation({
        route: DASHBOARD_ROUTE,
        languageCode: 'ar',
        cityCode,
        cityContentPath: `/${cityCode}/ar`
      })).toBe(`https://integreat.app/${cityCode}/ar`)
    })

    it('should match events route', () => {
      expect(urlFromRouteInformation({
        route: EVENTS_ROUTE,
        languageCode,
        cityCode,
        cityContentPath: undefined
      })).toBe(`https://integreat.app/${cityCode}/${languageCode}/${EVENTS_ROUTE}`)
    })

    it('should match single events route', () => {
      const pathname = `/${cityCode}/${languageCode}/${EVENTS_ROUTE}/1234`
      expect(urlFromRouteInformation({
        route: EVENTS_ROUTE,
        languageCode,
        cityCode,
        cityContentPath: pathname
      })).toBe(`https://integreat.app${pathname}`)
    })

    it('should match pois route', () => {
      expect(urlFromRouteInformation({
        route: POIS_ROUTE,
        languageCode,
        cityCode,
        cityContentPath: undefined
      })).toBe(`https://integreat.app/${cityCode}/${languageCode}/${POIS_ROUTE}`)
    })

    it('should match single pois route', () => {
      const pathname = `/${cityCode}/${languageCode}/${POIS_ROUTE}/1234`
      expect(urlFromRouteInformation({
        route: POIS_ROUTE,
        languageCode,
        cityCode,
        cityContentPath: pathname
      })).toBe(`https://integreat.app${pathname}`)
    })

    it('should match disclaimer route', () => {
      expect(urlFromRouteInformation({
        route: DISCLAIMER_ROUTE,
        languageCode,
        cityCode
      })).toBe(`https://integreat.app/${cityCode}/${languageCode}/${DISCLAIMER_ROUTE}`)
    })

    it('should match offers route', () => {
      expect(urlFromRouteInformation({
        route: OFFERS_ROUTE,
        languageCode,
        cityCode
      })).toBe(`https://integreat.app/${cityCode}/${languageCode}/${OFFERS_ROUTE}`)
    })

    it('should match sprungbrett offers route', () => {
      expect(urlFromRouteInformation({
        route: SPRUNGBRETT_OFFER_ROUTE,
        languageCode,
        cityCode
      })).toBe(`https://integreat.app/${cityCode}/${languageCode}/${OFFERS_ROUTE}/${SPRUNGBRETT_OFFER_ROUTE}`)
    })

    it('should match search route', () => {
      expect(urlFromRouteInformation({
        route: SEARCH_ROUTE,
        languageCode,
        cityCode
      })).toBe(`https://integreat.app/${cityCode}/${languageCode}/${SEARCH_ROUTE}`)
})

    it('should match local news route', () => {
      expect(urlFromRouteInformation({
        route: NEWS_ROUTE,
        newsType: LOCAL_NEWS_TYPE,
        newsId: undefined,
        languageCode,
        cityCode
      })).toBe(`https://integreat.app/${cityCode}/${languageCode}/${NEWS_ROUTE}/${LOCAL_NEWS_TYPE}`)
    })

    it('should match single local news route', () => {
      expect(urlFromRouteInformation({
        route: NEWS_ROUTE,
        newsType: LOCAL_NEWS_TYPE,
        newsId: '1234',
        languageCode,
        cityCode
      })).toBe(`https://integreat.app/${cityCode}/${languageCode}/${NEWS_ROUTE}/${LOCAL_NEWS_TYPE}/1234`)
    })

    it('should match tunews route', () => {
      expect(urlFromRouteInformation({
        route: NEWS_ROUTE,
        newsType: TU_NEWS_TYPE,
        newsId: undefined,
        languageCode,
        cityCode
      })).toBe(`https://integreat.app/${cityCode}/${languageCode}/${NEWS_ROUTE}/${TU_NEWS_TYPE}`)
    })

    it('should match single tunews route', () => {
      expect(urlFromRouteInformation({
        route: NEWS_ROUTE,
        newsType: TU_NEWS_TYPE,
        newsId: '1234',
        languageCode,
        cityCode
      })).toBe(`https://integreat.app/${cityCode}/${languageCode}/${NEWS_ROUTE}/${TU_NEWS_TYPE}/1234`)
    })

    it('should match categories route', () => {
      const pathname1 = `/${cityCode}/${languageCode}/some-category`
      const parser1 = new InternalPathnameParser(pathname1, languageCode, null)
      expect(parser1.route()).toEqual({
        route: CATEGORIES_ROUTE,
        languageCode,
        cityCode,
        cityContentPath: pathname1
      })
      const pathname2 = `/${cityCode}/${languageCode}/some-category/2nd-level/3rd-level`
      const parser2 = new InternalPathnameParser(pathname2, languageCode, null)
      expect(parser2.route()).toEqual({
        route: CATEGORIES_ROUTE,
        languageCode,
        cityCode,
        cityContentPath: pathname2
      })
    })
  })
})
