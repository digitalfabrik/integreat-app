import {
  CATEGORIES_ROUTE,
  IMPRINT_ROUTE,
  EVENTS_ROUTE,
  REGIONS_ROUTE,
  NEWS_ROUTE,
  PLACES_ROUTE,
  SEARCH_ROUTE,
} from '../index.ts'
import { regionContentPath, pathnameFromRouteInformation } from '../pathname.ts'

describe('pathname', () => {
  const regionCode = 'augsburg'
  const languageCode = 'de'

  describe('regionContentPath', () => {
    it('should return correct pathname for region content routes with path', () => {
      const pathname = regionContentPath({
        regionCode,
        languageCode,
        route: EVENTS_ROUTE,
        path: 'my-event-1235',
      })
      expect(pathname).toBe('/augsburg/de/events/my-event-1235')
    })

    it('should return correct pathname for region content routes without path', () => {
      const pathname = regionContentPath({
        regionCode,
        languageCode,
        route: EVENTS_ROUTE,
      })
      expect(pathname).toBe('/augsburg/de/events')
    })

    it('should return correct pathname for region content routes without route', () => {
      const pathname = regionContentPath({
        regionCode,
        languageCode,
        path: 'willkommen/ankommen',
      })
      expect(pathname).toBe('/augsburg/de/willkommen/ankommen')
    })

    it('should return correct pathname for region content routes without route or path', () => {
      const pathname = regionContentPath({
        regionCode,
        languageCode,
      })
      expect(pathname).toBe('/augsburg/de')
    })
  })

  describe('pathnameFromRouteInformation', () => {
    it('should return right pathname for regions route', () => {
      expect(
        pathnameFromRouteInformation({
          route: REGIONS_ROUTE,
          languageCode,
        }),
      ).toBe(`/${REGIONS_ROUTE}/${languageCode}`)
    })

    it('should match categories route if pathname is a region with a language', () => {
      expect(
        pathnameFromRouteInformation({
          route: CATEGORIES_ROUTE,
          languageCode: 'ar',
          regionCode,
          regionContentPath: `/${regionCode}/ar`,
        }),
      ).toBe(`/${regionCode}/ar`)
    })

    it('should match events route', () => {
      expect(
        pathnameFromRouteInformation({
          route: EVENTS_ROUTE,
          languageCode,
          regionCode,
        }),
      ).toBe(`/${regionCode}/${languageCode}/${EVENTS_ROUTE}`)
    })

    it('should match single events route', () => {
      const pathname = `/${regionCode}/${languageCode}/${EVENTS_ROUTE}/1234`
      expect(
        pathnameFromRouteInformation({
          route: EVENTS_ROUTE,
          languageCode,
          regionCode,
          slug: '1234',
        }),
      ).toBe(pathname)
    })

    it('should match places route', () => {
      expect(
        pathnameFromRouteInformation({
          route: PLACES_ROUTE,
          languageCode,
          regionCode,
        }),
      ).toBe(`/${regionCode}/${languageCode}/${PLACES_ROUTE}`)
    })

    it('should match single places route', () => {
      const slug = 'tuer-an-tuer'
      const pathname = `/${regionCode}/${languageCode}/${PLACES_ROUTE}/${slug}`
      expect(
        pathnameFromRouteInformation({
          route: PLACES_ROUTE,
          languageCode,
          regionCode,
          slug,
        }),
      ).toBe(pathname)
    })

    it('should match imprint route', () => {
      expect(
        pathnameFromRouteInformation({
          route: IMPRINT_ROUTE,
          languageCode,
          regionCode,
        }),
      ).toBe(`/${regionCode}/${languageCode}/${IMPRINT_ROUTE}`)
    })

    it('should match search route', () => {
      expect(
        pathnameFromRouteInformation({
          route: SEARCH_ROUTE,
          languageCode,
          regionCode,
        }),
      ).toBe(`/${regionCode}/${languageCode}/${SEARCH_ROUTE}`)
    })

    it('should match news route', () => {
      expect(
        pathnameFromRouteInformation({
          route: NEWS_ROUTE,
          id: undefined,
          languageCode,
          regionCode,
        }),
      ).toBe(`/${regionCode}/${languageCode}/${NEWS_ROUTE}`)
    })

    it('should match news detail route', () => {
      expect(
        pathnameFromRouteInformation({
          route: NEWS_ROUTE,
          id: 1234,
          languageCode,
          regionCode,
        }),
      ).toBe(`/${regionCode}/${languageCode}/${NEWS_ROUTE}/1234`)
    })

    it('should match categories route', () => {
      const pathname = `/${regionCode}/${languageCode}/my/custom/category`
      expect(
        pathnameFromRouteInformation({
          route: CATEGORIES_ROUTE,
          languageCode,
          regionCode,
          regionContentPath: pathname,
        }),
      ).toBe(pathname)
    })
  })
})
