import {
  CATEGORIES_ROUTE,
  IMPRINT_ROUTE,
  EVENTS_ROUTE,
  LANDING_ROUTE,
  LOCAL_NEWS_TYPE,
  NEWS_ROUTE,
  POIS_ROUTE,
  SEARCH_ROUTE,
  TU_NEWS_TYPE,
} from '..'

import InternalPathnameParser from '../InternalPathnameParser'
import { MULTIPOI_QUERY_KEY, POI_CATEGORY_QUERY_KEY, SEARCH_QUERY_KEY, ZOOM_QUERY_KEY } from '../query'

const regionCode = 'bochum'
const languageCode = 'de'

describe('InternalPathnameParser', () => {
  it('should match landing route if pathname is empty', () => {
    const parser = new InternalPathnameParser('', languageCode, null)
    expect(parser.route()).toEqual({
      route: LANDING_ROUTE,
      languageCode,
    })
  })

  it('should match landing route if pathname is landing without a language', () => {
    const parser = new InternalPathnameParser(`/${LANDING_ROUTE}`, languageCode, null)
    expect(parser.route()).toEqual({
      route: LANDING_ROUTE,
      languageCode,
    })
  })

  it('should match landing route if pathname is landing with a language', () => {
    const parser = new InternalPathnameParser(`/${LANDING_ROUTE}/ar`, languageCode, null)
    expect(parser.route()).toEqual({
      route: LANDING_ROUTE,
      languageCode: 'ar',
    })
  })

  it('should match categories route if pathname is a region without a language', () => {
    const parser = new InternalPathnameParser(`/${regionCode}`, languageCode, null)
    expect(parser.route()).toEqual({
      route: CATEGORIES_ROUTE,
      languageCode,
      regionCode,
      regionContentPath: `/${regionCode}/${languageCode}`,
    })
  })

  it('should match categories route if pathname is a region with a language', () => {
    const parser = new InternalPathnameParser(`/${regionCode}/ar`, languageCode, null)
    expect(parser.route()).toEqual({
      route: CATEGORIES_ROUTE,
      languageCode: 'ar',
      regionCode,
      regionContentPath: `/${regionCode}/ar`,
    })
  })

  it('should match events route', () => {
    const pathname = `/${regionCode}/${languageCode}/${EVENTS_ROUTE}`
    const parser = new InternalPathnameParser(pathname, languageCode, null)
    expect(parser.route()).toEqual({
      route: EVENTS_ROUTE,
      languageCode,
      regionCode,
    })
  })

  it('should match single events route', () => {
    const pathname = `/${regionCode}/${languageCode}/${EVENTS_ROUTE}/1234`
    const parser = new InternalPathnameParser(pathname, languageCode, null)
    expect(parser.route()).toEqual({
      route: EVENTS_ROUTE,
      languageCode,
      regionCode,
      slug: '1234',
    })
  })

  it('should match pois route', () => {
    const pathname = `/${regionCode}/${languageCode}/${POIS_ROUTE}`
    const parser = new InternalPathnameParser(pathname, languageCode, null)
    expect(parser.route()).toEqual({
      route: POIS_ROUTE,
      languageCode,
      regionCode,
    })
  })

  it('should match single pois route', () => {
    const slug = 'tuer-an-tuer'
    const pathname = `/${regionCode}/${languageCode}/${POIS_ROUTE}/${slug}`
    const parser = new InternalPathnameParser(pathname, languageCode, null)
    expect(parser.route()).toEqual({
      route: POIS_ROUTE,
      languageCode,
      regionCode,
      slug,
    })
  })

  it('should match multipoi route', () => {
    const pathname = `/${regionCode}/${languageCode}/${POIS_ROUTE}`
    const query = `?${MULTIPOI_QUERY_KEY}=1&${POI_CATEGORY_QUERY_KEY}=8`
    const parser = new InternalPathnameParser(pathname, languageCode, null, query)
    expect(parser.route()).toEqual({
      route: POIS_ROUTE,
      languageCode,
      regionCode,
      multipoi: 1,
      poiCategoryId: 8,
    })
  })

  it('should match imprint route', () => {
    const pathname = `/${regionCode}/${languageCode}/${IMPRINT_ROUTE}`
    const parser = new InternalPathnameParser(pathname, languageCode, null)
    expect(parser.route()).toEqual({
      route: IMPRINT_ROUTE,
      languageCode,
      regionCode,
    })
  })

  it('should match search route', () => {
    const pathname = `/${regionCode}/${languageCode}/${SEARCH_ROUTE}`
    const parser = new InternalPathnameParser(pathname, languageCode, null)
    expect(parser.route()).toEqual({
      route: SEARCH_ROUTE,
      languageCode,
      regionCode,
    })
  })

  it('should match news route', () => {
    const pathname = `/${regionCode}/${languageCode}/${NEWS_ROUTE}`
    const parser = new InternalPathnameParser(pathname, languageCode, null)
    expect(parser.route()).toEqual({
      route: NEWS_ROUTE,
      newsType: LOCAL_NEWS_TYPE,
      newsId: undefined,
      languageCode,
      regionCode,
    })
  })

  it('should match local news route', () => {
    const pathname = `/${regionCode}/${languageCode}/${NEWS_ROUTE}/${LOCAL_NEWS_TYPE}`
    const parser = new InternalPathnameParser(pathname, languageCode, null)
    expect(parser.route()).toEqual({
      route: NEWS_ROUTE,
      newsType: LOCAL_NEWS_TYPE,
      newsId: undefined,
      languageCode,
      regionCode,
    })
  })

  it('should match single local news route', () => {
    const pathname = `/${regionCode}/${languageCode}/${NEWS_ROUTE}/${LOCAL_NEWS_TYPE}/1234`
    const parser = new InternalPathnameParser(pathname, languageCode, null)
    expect(parser.route()).toEqual({
      route: NEWS_ROUTE,
      newsType: LOCAL_NEWS_TYPE,
      newsId: 1234,
      languageCode,
      regionCode,
    })
  })

  it('should match tunews route', () => {
    const pathname = `/${regionCode}/${languageCode}/${NEWS_ROUTE}/${TU_NEWS_TYPE}`
    const parser = new InternalPathnameParser(pathname, languageCode, null)
    expect(parser.route()).toEqual({
      route: NEWS_ROUTE,
      newsType: TU_NEWS_TYPE,
      newsId: undefined,
      languageCode,
      regionCode,
    })
  })

  it('should match single tunews route', () => {
    const pathname = `/${regionCode}/${languageCode}/${NEWS_ROUTE}/${TU_NEWS_TYPE}/1234`
    const parser = new InternalPathnameParser(pathname, languageCode, null)
    expect(parser.route()).toEqual({
      route: NEWS_ROUTE,
      newsType: TU_NEWS_TYPE,
      newsId: 1234,
      languageCode,
      regionCode,
    })
  })

  it('should not match any other news type', () => {
    const pathname = `/${regionCode}/${languageCode}/${NEWS_ROUTE}/random/1234`
    const parser = new InternalPathnameParser(pathname, languageCode, null)
    expect(parser.route()).toBeNull()
  })

  it('should match categories route', () => {
    const pathname1 = `/${regionCode}/${languageCode}/some-category`
    const parser1 = new InternalPathnameParser(pathname1, languageCode, null)
    expect(parser1.route()).toEqual({
      route: CATEGORIES_ROUTE,
      languageCode,
      regionCode,
      regionContentPath: pathname1,
    })
    const pathname2 = `/${regionCode}/${languageCode}/some-category/2nd-level/3rd-level`
    const parser2 = new InternalPathnameParser(pathname2, languageCode, null)
    expect(parser2.route()).toEqual({
      route: CATEGORIES_ROUTE,
      languageCode,
      regionCode,
      regionContentPath: pathname2,
    })
  })

  describe('fixed region', () => {
    const fixedRegion = 'aschaffenburg'
    it('should match categories route if pathname is emtpy', () => {
      const parser = new InternalPathnameParser('', languageCode, fixedRegion)
      expect(parser.route()).toEqual({
        route: CATEGORIES_ROUTE,
        languageCode,
        regionCode: fixedRegion,
        regionContentPath: `/${fixedRegion}/${languageCode}`,
      })
    })

    it('should match categories route if pathname is landing without a language', () => {
      const parser = new InternalPathnameParser(`/${LANDING_ROUTE}`, languageCode, fixedRegion)
      expect(parser.route()).toEqual({
        route: CATEGORIES_ROUTE,
        languageCode,
        regionCode: fixedRegion,
        regionContentPath: `/${fixedRegion}/${languageCode}`,
      })
    })

    it('should match categories route if pathname is landing with a language', () => {
      const parser = new InternalPathnameParser(`/${LANDING_ROUTE}/ar/`, languageCode, fixedRegion)
      expect(parser.route()).toEqual({
        route: CATEGORIES_ROUTE,
        languageCode: 'ar',
        regionCode: fixedRegion,
        regionContentPath: `/${fixedRegion}/ar`,
      })
    })

    it('should match categories route if pathname the fixed region without a language', () => {
      const parser = new InternalPathnameParser(`/${fixedRegion}/`, languageCode, fixedRegion)
      expect(parser.route()).toEqual({
        route: CATEGORIES_ROUTE,
        languageCode,
        regionCode: fixedRegion,
        regionContentPath: `/${fixedRegion}/${languageCode}`,
      })
    })

    it('should match categories route if pathname is the fixed region with a language', () => {
      const parser = new InternalPathnameParser(`/${fixedRegion}/ar`, languageCode, fixedRegion)
      expect(parser.route()).toEqual({
        route: CATEGORIES_ROUTE,
        languageCode: 'ar',
        regionCode: fixedRegion,
        regionContentPath: `/${fixedRegion}/ar`,
      })
    })

    it('should match events route', () => {
      const pathname = `/${fixedRegion}/${languageCode}/${EVENTS_ROUTE}`
      const parser = new InternalPathnameParser(pathname, languageCode, fixedRegion)
      expect(parser.route()).toEqual({
        route: EVENTS_ROUTE,
        languageCode,
        regionCode: fixedRegion,
      })
    })

    it('should match single events route', () => {
      const pathname = `/${fixedRegion}/${languageCode}/${EVENTS_ROUTE}/1234`
      const trailingPathname = `${pathname}/`
      const parser = new InternalPathnameParser(trailingPathname, languageCode, fixedRegion)
      expect(parser.route()).toEqual({
        route: EVENTS_ROUTE,
        languageCode,
        regionCode: fixedRegion,
        slug: '1234',
      })
    })

    it('should match pois route', () => {
      const pathname = `/${fixedRegion}/${languageCode}/${POIS_ROUTE}`
      const parser = new InternalPathnameParser(pathname, languageCode, fixedRegion)
      expect(parser.route()).toEqual({
        route: POIS_ROUTE,
        languageCode,
        regionCode: fixedRegion,
      })
    })

    it('should match single pois route', () => {
      const slug = 'tuer-an-tuer'
      const pathname = `/${fixedRegion}/${languageCode}/${POIS_ROUTE}/${slug}`
      const parser = new InternalPathnameParser(pathname, languageCode, fixedRegion)
      expect(parser.route()).toEqual({
        route: POIS_ROUTE,
        languageCode,
        regionCode: fixedRegion,
        slug,
      })
    })

    it('should match single pois route with query params', () => {
      const slug = 'tuer-an-tuer'
      const pathname = `/${fixedRegion}/${languageCode}/${POIS_ROUTE}/${slug}`
      const query = `?${MULTIPOI_QUERY_KEY}=2&${ZOOM_QUERY_KEY}=10&${POI_CATEGORY_QUERY_KEY}=8`
      const parser = new InternalPathnameParser(pathname, languageCode, fixedRegion, query)
      expect(parser.route()).toEqual({
        route: POIS_ROUTE,
        languageCode,
        regionCode: fixedRegion,
        slug,
        multipoi: 2,
        zoom: 10,
        poiCategoryId: 8,
      })
    })

    it('should match imprint route', () => {
      const pathname = `/${fixedRegion}/${languageCode}/${IMPRINT_ROUTE}`
      const parser = new InternalPathnameParser(pathname, languageCode, fixedRegion)
      expect(parser.route()).toEqual({
        route: IMPRINT_ROUTE,
        languageCode,
        regionCode: fixedRegion,
      })
    })

    it('should match search route', () => {
      const pathname = `/${fixedRegion}/${languageCode}/${SEARCH_ROUTE}`
      const parser = new InternalPathnameParser(pathname, languageCode, fixedRegion)
      expect(parser.route()).toEqual({
        route: SEARCH_ROUTE,
        languageCode,
        regionCode: fixedRegion,
      })
    })

    it('should match search query', () => {
      const pathname = `/${fixedRegion}/${languageCode}/${SEARCH_ROUTE}`
      const query = `?${SEARCH_QUERY_KEY}=zeugnis`
      const parser = new InternalPathnameParser(pathname, languageCode, fixedRegion, query)
      expect(parser.route()).toEqual({
        route: SEARCH_ROUTE,
        languageCode,
        regionCode: fixedRegion,
        searchText: 'zeugnis',
      })
    })

    it('should match news route', () => {
      const pathname = `/${fixedRegion}/${languageCode}/${NEWS_ROUTE}`
      const parser = new InternalPathnameParser(pathname, languageCode, fixedRegion)
      expect(parser.route()).toEqual({
        route: NEWS_ROUTE,
        newsType: LOCAL_NEWS_TYPE,
        newsId: undefined,
        languageCode,
        regionCode: fixedRegion,
      })
    })

    it('should match local news route', () => {
      const pathname = `/${fixedRegion}/${languageCode}/${NEWS_ROUTE}/${LOCAL_NEWS_TYPE}`
      const parser = new InternalPathnameParser(pathname, languageCode, fixedRegion)
      expect(parser.route()).toEqual({
        route: NEWS_ROUTE,
        newsType: LOCAL_NEWS_TYPE,
        newsId: undefined,
        languageCode,
        regionCode: fixedRegion,
      })
    })

    it('should match single local news route', () => {
      const pathname = `/${fixedRegion}/${languageCode}/${NEWS_ROUTE}/${LOCAL_NEWS_TYPE}/1234`
      const parser = new InternalPathnameParser(pathname, languageCode, fixedRegion)
      expect(parser.route()).toEqual({
        route: NEWS_ROUTE,
        newsType: LOCAL_NEWS_TYPE,
        newsId: 1234,
        languageCode,
        regionCode: fixedRegion,
      })
    })

    it('should match tunews route', () => {
      const pathname = `/${fixedRegion}/${languageCode}/${NEWS_ROUTE}/${TU_NEWS_TYPE}`
      const parser = new InternalPathnameParser(pathname, languageCode, fixedRegion)
      expect(parser.route()).toEqual({
        route: NEWS_ROUTE,
        newsType: TU_NEWS_TYPE,
        newsId: undefined,
        languageCode,
        regionCode: fixedRegion,
      })
    })

    it('should match single tunews route', () => {
      const pathname = `/${fixedRegion}/${languageCode}/${NEWS_ROUTE}/${TU_NEWS_TYPE}/1234`
      const parser = new InternalPathnameParser(pathname, languageCode, fixedRegion)
      expect(parser.route()).toEqual({
        route: NEWS_ROUTE,
        newsType: TU_NEWS_TYPE,
        newsId: 1234,
        languageCode,
        regionCode: fixedRegion,
      })
    })

    it('should not match any other news type', () => {
      const pathname = `/${fixedRegion}/${languageCode}/${NEWS_ROUTE}/random/1234`
      const parser = new InternalPathnameParser(pathname, languageCode, fixedRegion)
      expect(parser.route()).toBeNull()
    })

    it('should match categories route', () => {
      const pathname1 = `/${fixedRegion}/${languageCode}/some-category`
      const parser1 = new InternalPathnameParser(pathname1, languageCode, fixedRegion)
      expect(parser1.route()).toEqual({
        route: CATEGORIES_ROUTE,
        languageCode,
        regionCode: fixedRegion,
        regionContentPath: pathname1,
      })
      const pathname2 = `/${fixedRegion}/${languageCode}/some-category/2nd-level/3rd-level`
      const trailingPathname2 = `${pathname2}/`
      const parser2 = new InternalPathnameParser(trailingPathname2, languageCode, fixedRegion)
      expect(parser2.route()).toEqual({
        route: CATEGORIES_ROUTE,
        languageCode,
        regionCode: fixedRegion,
        regionContentPath: pathname2,
      })
    })

    it('should not match any route if the region is not the fixed region', () => {
      const parser1 = new InternalPathnameParser(`/${regionCode}`, languageCode, fixedRegion)
      expect(parser1.route()).toBeNull()
      const parser2 = new InternalPathnameParser(`/${regionCode}/${languageCode}`, languageCode, fixedRegion)
      expect(parser2.route()).toBeNull()
      const parser3 = new InternalPathnameParser(`/${regionCode}/${languageCode}/events`, languageCode, fixedRegion)
      expect(parser3.route()).toBeNull()
      const parser4 = new InternalPathnameParser(`/${regionCode}/${languageCode}/pois`, languageCode, fixedRegion)
      expect(parser4.route()).toBeNull()
      const parser5 = new InternalPathnameParser(`/${regionCode}/${languageCode}/news`, languageCode, fixedRegion)
      expect(parser5.route()).toBeNull()
      const parser6 = new InternalPathnameParser(`/${regionCode}/${languageCode}/offers`, languageCode, fixedRegion)
      expect(parser6.route()).toBeNull()
      const parser7 = new InternalPathnameParser(`/${regionCode}/${languageCode}/imprint`, languageCode, fixedRegion)
      expect(parser7.route()).toBeNull()
      const parser8 = new InternalPathnameParser(`/${regionCode}/${languageCode}/search`, languageCode, fixedRegion)
      expect(parser8.route()).toBeNull()
      const parser9 = new InternalPathnameParser(
        `/${regionCode}/${languageCode}/some-category`,
        languageCode,
        fixedRegion,
      )
      expect(parser9.route()).toBeNull()
    })
  })

  describe('language independent urls', () => {
    it('should match events route', () => {
      const pathname = `/${regionCode}/${EVENTS_ROUTE}`
      const parser = new InternalPathnameParser(pathname, languageCode, null)
      expect(parser.route()).toEqual({
        route: EVENTS_ROUTE,
        languageCode,
        regionCode,
      })
    })

    it('should match single events route', () => {
      const pathname = `/${regionCode}/${EVENTS_ROUTE}/1234`
      const parser = new InternalPathnameParser(pathname, languageCode, null)
      expect(parser.route()).toEqual({
        route: EVENTS_ROUTE,
        languageCode,
        regionCode,
        slug: '1234',
      })
    })

    it('should match pois route', () => {
      const pathname = `/${regionCode}/${POIS_ROUTE}`
      const parser = new InternalPathnameParser(pathname, languageCode, null)
      expect(parser.route()).toEqual({
        route: POIS_ROUTE,
        languageCode,
        regionCode,
      })
    })

    it('should match single pois route', () => {
      const slug = 'tuer-an-tuer'
      const pathname = `/${regionCode}/${POIS_ROUTE}/${slug}`
      const parser = new InternalPathnameParser(pathname, languageCode, null)
      expect(parser.route()).toEqual({
        route: POIS_ROUTE,
        languageCode,
        regionCode,
        slug,
      })
    })

    it('should match multipoi route', () => {
      const pathname = `/${regionCode}/${POIS_ROUTE}`
      const query = `?${MULTIPOI_QUERY_KEY}=1&${POI_CATEGORY_QUERY_KEY}=8`
      const parser = new InternalPathnameParser(pathname, languageCode, null, query)
      expect(parser.route()).toEqual({
        route: POIS_ROUTE,
        languageCode,
        regionCode,
        multipoi: 1,
        poiCategoryId: 8,
      })
    })

    it('should match imprint route', () => {
      const pathname = `/${regionCode}/${IMPRINT_ROUTE}`
      const parser = new InternalPathnameParser(pathname, languageCode, null)
      expect(parser.route()).toEqual({
        route: IMPRINT_ROUTE,
        languageCode,
        regionCode,
      })
    })
  })
})
