import {
  CATEGORIES_ROUTE,
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

import InternalPathnameParser from '../InternalPathnameParser'
import { MULTIPOI_QUERY_KEY, POI_CATEGORY_QUERY_KEY, SEARCH_QUERY_KEY, ZOOM_QUERY_KEY } from '../query'

const cityCode = 'bochum'
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

  it('should match jpal tracking route without tracking code', () => {
    const parser = new InternalPathnameParser(`/${JPAL_TRACKING_ROUTE}/`, languageCode, null)
    expect(parser.route()).toEqual({
      route: JPAL_TRACKING_ROUTE,
      trackingCode: null,
    })
  })

  it('should match tracking route with tracking code', () => {
    const parser = new InternalPathnameParser(`/${JPAL_TRACKING_ROUTE}/abcdef12345`, languageCode, null)
    expect(parser.route()).toEqual({
      route: JPAL_TRACKING_ROUTE,
      trackingCode: 'abcdef12345',
    })
  })

  it('should match categories route if pathname is a city without a language', () => {
    const parser = new InternalPathnameParser(`/${cityCode}`, languageCode, null)
    expect(parser.route()).toEqual({
      route: CATEGORIES_ROUTE,
      languageCode,
      cityCode,
      cityContentPath: `/${cityCode}/${languageCode}`,
    })
  })

  it('should match categories route if pathname is a city with a language', () => {
    const parser = new InternalPathnameParser(`/${cityCode}/ar`, languageCode, null)
    expect(parser.route()).toEqual({
      route: CATEGORIES_ROUTE,
      languageCode: 'ar',
      cityCode,
      cityContentPath: `/${cityCode}/ar`,
    })
  })

  it('should match events route', () => {
    const pathname = `/${cityCode}/${languageCode}/${EVENTS_ROUTE}`
    const parser = new InternalPathnameParser(pathname, languageCode, null)
    expect(parser.route()).toEqual({
      route: EVENTS_ROUTE,
      languageCode,
      cityCode,
    })
  })

  it('should match single events route', () => {
    const pathname = `/${cityCode}/${languageCode}/${EVENTS_ROUTE}/1234`
    const parser = new InternalPathnameParser(pathname, languageCode, null)
    expect(parser.route()).toEqual({
      route: EVENTS_ROUTE,
      languageCode,
      cityCode,
      slug: '1234',
    })
  })

  it('should match pois route', () => {
    const pathname = `/${cityCode}/${languageCode}/${POIS_ROUTE}`
    const parser = new InternalPathnameParser(pathname, languageCode, null)
    expect(parser.route()).toEqual({
      route: POIS_ROUTE,
      languageCode,
      cityCode,
    })
  })

  it('should match single pois route', () => {
    const slug = 'tuer-an-tuer'
    const pathname = `/${cityCode}/${languageCode}/${POIS_ROUTE}/${slug}`
    const parser = new InternalPathnameParser(pathname, languageCode, null)
    expect(parser.route()).toEqual({
      route: POIS_ROUTE,
      languageCode,
      cityCode,
      slug,
    })
  })

  it('should match multipoi route', () => {
    const pathname = `/${cityCode}/${languageCode}/${POIS_ROUTE}`
    const query = `?${MULTIPOI_QUERY_KEY}=1&${POI_CATEGORY_QUERY_KEY}=8`
    const parser = new InternalPathnameParser(pathname, languageCode, null, query)
    expect(parser.route()).toEqual({
      route: POIS_ROUTE,
      languageCode,
      cityCode,
      multipoi: 1,
      poiCategoryId: 8,
    })
  })

  it('should match disclaimer route', () => {
    const pathname = `/${cityCode}/${languageCode}/${DISCLAIMER_ROUTE}`
    const parser = new InternalPathnameParser(pathname, languageCode, null)
    expect(parser.route()).toEqual({
      route: DISCLAIMER_ROUTE,
      languageCode,
      cityCode,
    })
  })

  it('should match offers route', () => {
    const pathname = `/${cityCode}/${languageCode}/${OFFERS_ROUTE}`
    const parser = new InternalPathnameParser(pathname, languageCode, null)
    expect(parser.route()).toEqual({
      route: OFFERS_ROUTE,
      languageCode,
      cityCode,
    })
  })

  it('should match sprungbrett offers route', () => {
    const pathname = `/${cityCode}/${languageCode}/${OFFERS_ROUTE}/${SPRUNGBRETT_OFFER_ROUTE}`
    const parser = new InternalPathnameParser(pathname, languageCode, null)
    expect(parser.route()).toEqual({
      route: SPRUNGBRETT_OFFER_ROUTE,
      languageCode,
      cityCode,
    })
  })

  it('should not match any other offer', () => {
    const pathname = `/${cityCode}/${languageCode}/${OFFERS_ROUTE}/random`
    const parser = new InternalPathnameParser(pathname, languageCode, null)
    expect(parser.route()).toBeNull()
  })

  it('should match search route', () => {
    const pathname = `/${cityCode}/${languageCode}/${SEARCH_ROUTE}`
    const parser = new InternalPathnameParser(pathname, languageCode, null)
    expect(parser.route()).toEqual({
      route: SEARCH_ROUTE,
      languageCode,
      cityCode,
    })
  })

  it('should match news route', () => {
    const pathname = `/${cityCode}/${languageCode}/${NEWS_ROUTE}`
    const parser = new InternalPathnameParser(pathname, languageCode, null)
    expect(parser.route()).toEqual({
      route: NEWS_ROUTE,
      newsType: LOCAL_NEWS_TYPE,
      newsId: undefined,
      languageCode,
      cityCode,
    })
  })

  it('should match local news route', () => {
    const pathname = `/${cityCode}/${languageCode}/${NEWS_ROUTE}/${LOCAL_NEWS_TYPE}`
    const parser = new InternalPathnameParser(pathname, languageCode, null)
    expect(parser.route()).toEqual({
      route: NEWS_ROUTE,
      newsType: LOCAL_NEWS_TYPE,
      newsId: undefined,
      languageCode,
      cityCode,
    })
  })

  it('should match single local news route', () => {
    const pathname = `/${cityCode}/${languageCode}/${NEWS_ROUTE}/${LOCAL_NEWS_TYPE}/1234`
    const parser = new InternalPathnameParser(pathname, languageCode, null)
    expect(parser.route()).toEqual({
      route: NEWS_ROUTE,
      newsType: LOCAL_NEWS_TYPE,
      newsId: '1234',
      languageCode,
      cityCode,
    })
  })

  it('should match tunews route', () => {
    const pathname = `/${cityCode}/${languageCode}/${NEWS_ROUTE}/${TU_NEWS_TYPE}`
    const parser = new InternalPathnameParser(pathname, languageCode, null)
    expect(parser.route()).toEqual({
      route: NEWS_ROUTE,
      newsType: TU_NEWS_TYPE,
      newsId: undefined,
      languageCode,
      cityCode,
    })
  })

  it('should match single tunews route', () => {
    const pathname = `/${cityCode}/${languageCode}/${NEWS_ROUTE}/${TU_NEWS_TYPE}/1234`
    const parser = new InternalPathnameParser(pathname, languageCode, null)
    expect(parser.route()).toEqual({
      route: NEWS_ROUTE,
      newsType: TU_NEWS_TYPE,
      newsId: '1234',
      languageCode,
      cityCode,
    })
  })

  it('should not match any other news type', () => {
    const pathname = `/${cityCode}/${languageCode}/${NEWS_ROUTE}/random/1234`
    const parser = new InternalPathnameParser(pathname, languageCode, null)
    expect(parser.route()).toBeNull()
  })

  it('should match categories route', () => {
    const pathname1 = `/${cityCode}/${languageCode}/some-category`
    const parser1 = new InternalPathnameParser(pathname1, languageCode, null)
    expect(parser1.route()).toEqual({
      route: CATEGORIES_ROUTE,
      languageCode,
      cityCode,
      cityContentPath: pathname1,
    })
    const pathname2 = `/${cityCode}/${languageCode}/some-category/2nd-level/3rd-level`
    const parser2 = new InternalPathnameParser(pathname2, languageCode, null)
    expect(parser2.route()).toEqual({
      route: CATEGORIES_ROUTE,
      languageCode,
      cityCode,
      cityContentPath: pathname2,
    })
  })

  describe('fixed city', () => {
    const fixedCity = 'aschaffenburg'
    it('should match categories route if pathname is emtpy', () => {
      const parser = new InternalPathnameParser('', languageCode, fixedCity)
      expect(parser.route()).toEqual({
        route: CATEGORIES_ROUTE,
        languageCode,
        cityCode: fixedCity,
        cityContentPath: `/${fixedCity}/${languageCode}`,
      })
    })

    it('should match categories route if pathname is landing without a language', () => {
      const parser = new InternalPathnameParser(`/${LANDING_ROUTE}`, languageCode, fixedCity)
      expect(parser.route()).toEqual({
        route: CATEGORIES_ROUTE,
        languageCode,
        cityCode: fixedCity,
        cityContentPath: `/${fixedCity}/${languageCode}`,
      })
    })

    it('should match categories route if pathname is landing with a language', () => {
      const parser = new InternalPathnameParser(`/${LANDING_ROUTE}/ar/`, languageCode, fixedCity)
      expect(parser.route()).toEqual({
        route: CATEGORIES_ROUTE,
        languageCode: 'ar',
        cityCode: fixedCity,
        cityContentPath: `/${fixedCity}/ar`,
      })
    })

    it('should match categories route if pathname the fixed city without a language', () => {
      const parser = new InternalPathnameParser(`/${fixedCity}/`, languageCode, fixedCity)
      expect(parser.route()).toEqual({
        route: CATEGORIES_ROUTE,
        languageCode,
        cityCode: fixedCity,
        cityContentPath: `/${fixedCity}/${languageCode}`,
      })
    })

    it('should match categories route if pathname is the fixed city with a language', () => {
      const parser = new InternalPathnameParser(`/${fixedCity}/ar`, languageCode, fixedCity)
      expect(parser.route()).toEqual({
        route: CATEGORIES_ROUTE,
        languageCode: 'ar',
        cityCode: fixedCity,
        cityContentPath: `/${fixedCity}/ar`,
      })
    })

    it('should match events route', () => {
      const pathname = `/${fixedCity}/${languageCode}/${EVENTS_ROUTE}`
      const parser = new InternalPathnameParser(pathname, languageCode, fixedCity)
      expect(parser.route()).toEqual({
        route: EVENTS_ROUTE,
        languageCode,
        cityCode: fixedCity,
      })
    })

    it('should match single events route', () => {
      const pathname = `/${fixedCity}/${languageCode}/${EVENTS_ROUTE}/1234`
      const trailingPathname = `${pathname}/`
      const parser = new InternalPathnameParser(trailingPathname, languageCode, fixedCity)
      expect(parser.route()).toEqual({
        route: EVENTS_ROUTE,
        languageCode,
        cityCode: fixedCity,
        slug: '1234',
      })
    })

    it('should match pois route', () => {
      const pathname = `/${fixedCity}/${languageCode}/${POIS_ROUTE}`
      const parser = new InternalPathnameParser(pathname, languageCode, fixedCity)
      expect(parser.route()).toEqual({
        route: POIS_ROUTE,
        languageCode,
        cityCode: fixedCity,
      })
    })

    it('should match single pois route', () => {
      const slug = 'tuer-an-tuer'
      const pathname = `/${fixedCity}/${languageCode}/${POIS_ROUTE}/${slug}`
      const parser = new InternalPathnameParser(pathname, languageCode, fixedCity)
      expect(parser.route()).toEqual({
        route: POIS_ROUTE,
        languageCode,
        cityCode: fixedCity,
        slug,
      })
    })

    it('should match single pois route with query params', () => {
      const slug = 'tuer-an-tuer'
      const pathname = `/${fixedCity}/${languageCode}/${POIS_ROUTE}/${slug}`
      const query = `?${MULTIPOI_QUERY_KEY}=2&${ZOOM_QUERY_KEY}=10&${POI_CATEGORY_QUERY_KEY}=8`
      const parser = new InternalPathnameParser(pathname, languageCode, fixedCity, query)
      expect(parser.route()).toEqual({
        route: POIS_ROUTE,
        languageCode,
        cityCode: fixedCity,
        slug,
        multipoi: 2,
        zoom: 10,
        poiCategoryId: 8,
      })
    })

    it('should match disclaimer route', () => {
      const pathname = `/${fixedCity}/${languageCode}/${DISCLAIMER_ROUTE}`
      const parser = new InternalPathnameParser(pathname, languageCode, fixedCity)
      expect(parser.route()).toEqual({
        route: DISCLAIMER_ROUTE,
        languageCode,
        cityCode: fixedCity,
      })
    })

    it('should match offers route', () => {
      const pathname = `/${fixedCity}/${languageCode}/${OFFERS_ROUTE}`
      const parser = new InternalPathnameParser(pathname, languageCode, fixedCity)
      expect(parser.route()).toEqual({
        route: OFFERS_ROUTE,
        languageCode,
        cityCode: fixedCity,
      })
    })

    it('should match sprungbrett offers route', () => {
      const pathname = `/${fixedCity}/${languageCode}/${OFFERS_ROUTE}/${SPRUNGBRETT_OFFER_ROUTE}`
      const parser = new InternalPathnameParser(pathname, languageCode, fixedCity)
      expect(parser.route()).toEqual({
        route: SPRUNGBRETT_OFFER_ROUTE,
        languageCode,
        cityCode: fixedCity,
      })
    })

    it('should not match any other offer', () => {
      const pathname = `/${fixedCity}/${languageCode}/${OFFERS_ROUTE}/random`
      const parser = new InternalPathnameParser(pathname, languageCode, fixedCity)
      expect(parser.route()).toBeNull()
    })

    it('should match search route', () => {
      const pathname = `/${fixedCity}/${languageCode}/${SEARCH_ROUTE}`
      const parser = new InternalPathnameParser(pathname, languageCode, fixedCity)
      expect(parser.route()).toEqual({
        route: SEARCH_ROUTE,
        languageCode,
        cityCode: fixedCity,
      })
    })

    it('should match search query', () => {
      const pathname = `/${fixedCity}/${languageCode}/${SEARCH_ROUTE}`
      const query = `?${SEARCH_QUERY_KEY}=zeugnis`
      const parser = new InternalPathnameParser(pathname, languageCode, fixedCity, query)
      expect(parser.route()).toEqual({
        route: SEARCH_ROUTE,
        languageCode,
        cityCode: fixedCity,
        searchText: 'zeugnis',
      })
    })

    it('should match news route', () => {
      const pathname = `/${fixedCity}/${languageCode}/${NEWS_ROUTE}`
      const parser = new InternalPathnameParser(pathname, languageCode, fixedCity)
      expect(parser.route()).toEqual({
        route: NEWS_ROUTE,
        newsType: LOCAL_NEWS_TYPE,
        newsId: undefined,
        languageCode,
        cityCode: fixedCity,
      })
    })

    it('should match local news route', () => {
      const pathname = `/${fixedCity}/${languageCode}/${NEWS_ROUTE}/${LOCAL_NEWS_TYPE}`
      const parser = new InternalPathnameParser(pathname, languageCode, fixedCity)
      expect(parser.route()).toEqual({
        route: NEWS_ROUTE,
        newsType: LOCAL_NEWS_TYPE,
        newsId: undefined,
        languageCode,
        cityCode: fixedCity,
      })
    })

    it('should match single local news route', () => {
      const pathname = `/${fixedCity}/${languageCode}/${NEWS_ROUTE}/${LOCAL_NEWS_TYPE}/1234`
      const parser = new InternalPathnameParser(pathname, languageCode, fixedCity)
      expect(parser.route()).toEqual({
        route: NEWS_ROUTE,
        newsType: LOCAL_NEWS_TYPE,
        newsId: '1234',
        languageCode,
        cityCode: fixedCity,
      })
    })

    it('should match tunews route', () => {
      const pathname = `/${fixedCity}/${languageCode}/${NEWS_ROUTE}/${TU_NEWS_TYPE}`
      const parser = new InternalPathnameParser(pathname, languageCode, fixedCity)
      expect(parser.route()).toEqual({
        route: NEWS_ROUTE,
        newsType: TU_NEWS_TYPE,
        newsId: undefined,
        languageCode,
        cityCode: fixedCity,
      })
    })

    it('should match single tunews route', () => {
      const pathname = `/${fixedCity}/${languageCode}/${NEWS_ROUTE}/${TU_NEWS_TYPE}/1234`
      const parser = new InternalPathnameParser(pathname, languageCode, fixedCity)
      expect(parser.route()).toEqual({
        route: NEWS_ROUTE,
        newsType: TU_NEWS_TYPE,
        newsId: '1234',
        languageCode,
        cityCode: fixedCity,
      })
    })

    it('should not match any other news type', () => {
      const pathname = `/${fixedCity}/${languageCode}/${NEWS_ROUTE}/random/1234`
      const parser = new InternalPathnameParser(pathname, languageCode, fixedCity)
      expect(parser.route()).toBeNull()
    })

    it('should match categories route', () => {
      const pathname1 = `/${fixedCity}/${languageCode}/some-category`
      const parser1 = new InternalPathnameParser(pathname1, languageCode, fixedCity)
      expect(parser1.route()).toEqual({
        route: CATEGORIES_ROUTE,
        languageCode,
        cityCode: fixedCity,
        cityContentPath: pathname1,
      })
      const pathname2 = `/${fixedCity}/${languageCode}/some-category/2nd-level/3rd-level`
      const trailingPathname2 = `${pathname2}/`
      const parser2 = new InternalPathnameParser(trailingPathname2, languageCode, fixedCity)
      expect(parser2.route()).toEqual({
        route: CATEGORIES_ROUTE,
        languageCode,
        cityCode: fixedCity,
        cityContentPath: pathname2,
      })
    })

    it('should not match any route if the city is not the fixed city', () => {
      const parser1 = new InternalPathnameParser(`/${cityCode}`, languageCode, fixedCity)
      expect(parser1.route()).toBeNull()
      const parser2 = new InternalPathnameParser(`/${cityCode}/${languageCode}`, languageCode, fixedCity)
      expect(parser2.route()).toBeNull()
      const parser3 = new InternalPathnameParser(`/${cityCode}/${languageCode}/events`, languageCode, fixedCity)
      expect(parser3.route()).toBeNull()
      const parser4 = new InternalPathnameParser(`/${cityCode}/${languageCode}/pois`, languageCode, fixedCity)
      expect(parser4.route()).toBeNull()
      const parser5 = new InternalPathnameParser(`/${cityCode}/${languageCode}/news`, languageCode, fixedCity)
      expect(parser5.route()).toBeNull()
      const parser6 = new InternalPathnameParser(`/${cityCode}/${languageCode}/offers`, languageCode, fixedCity)
      expect(parser6.route()).toBeNull()
      const parser7 = new InternalPathnameParser(`/${cityCode}/${languageCode}/disclaimer`, languageCode, fixedCity)
      expect(parser7.route()).toBeNull()
      const parser8 = new InternalPathnameParser(`/${cityCode}/${languageCode}/search`, languageCode, fixedCity)
      expect(parser8.route()).toBeNull()
      const parser9 = new InternalPathnameParser(`/${cityCode}/${languageCode}/some-category`, languageCode, fixedCity)
      expect(parser9.route()).toBeNull()
    })
  })

  describe('language independent urls', () => {
    it('should match events route', () => {
      const pathname = `/${cityCode}/${EVENTS_ROUTE}`
      const parser = new InternalPathnameParser(pathname, languageCode, null)
      expect(parser.route()).toEqual({
        route: EVENTS_ROUTE,
        languageCode,
        cityCode,
      })
    })

    it('should match single events route', () => {
      const pathname = `/${cityCode}/${EVENTS_ROUTE}/1234`
      const parser = new InternalPathnameParser(pathname, languageCode, null)
      expect(parser.route()).toEqual({
        route: EVENTS_ROUTE,
        languageCode,
        cityCode,
        slug: '1234',
      })
    })

    it('should match pois route', () => {
      const pathname = `/${cityCode}/${POIS_ROUTE}`
      const parser = new InternalPathnameParser(pathname, languageCode, null)
      expect(parser.route()).toEqual({
        route: POIS_ROUTE,
        languageCode,
        cityCode,
      })
    })

    it('should match single pois route', () => {
      const slug = 'tuer-an-tuer'
      const pathname = `/${cityCode}/${POIS_ROUTE}/${slug}`
      const parser = new InternalPathnameParser(pathname, languageCode, null)
      expect(parser.route()).toEqual({
        route: POIS_ROUTE,
        languageCode,
        cityCode,
        slug,
      })
    })

    it('should match multipoi route', () => {
      const pathname = `/${cityCode}/${POIS_ROUTE}`
      const query = `?${MULTIPOI_QUERY_KEY}=1&${POI_CATEGORY_QUERY_KEY}=8`
      const parser = new InternalPathnameParser(pathname, languageCode, null, query)
      expect(parser.route()).toEqual({
        route: POIS_ROUTE,
        languageCode,
        cityCode,
        multipoi: 1,
        poiCategoryId: 8,
      })
    })

    it('should match disclaimer route', () => {
      const pathname = `/${cityCode}/${DISCLAIMER_ROUTE}`
      const parser = new InternalPathnameParser(pathname, languageCode, null)
      expect(parser.route()).toEqual({
        route: DISCLAIMER_ROUTE,
        languageCode,
        cityCode,
      })
    })

    it('should match offers route', () => {
      const pathname = `/${cityCode}/${OFFERS_ROUTE}`
      const parser = new InternalPathnameParser(pathname, languageCode, null)
      expect(parser.route()).toEqual({
        route: OFFERS_ROUTE,
        languageCode,
        cityCode,
      })
    })

    it('should match sprungbrett offers route', () => {
      const pathname = `/${cityCode}/${OFFERS_ROUTE}/${SPRUNGBRETT_OFFER_ROUTE}`
      const parser = new InternalPathnameParser(pathname, languageCode, null)
      expect(parser.route()).toEqual({
        route: SPRUNGBRETT_OFFER_ROUTE,
        languageCode,
        cityCode,
      })
    })
  })
})
