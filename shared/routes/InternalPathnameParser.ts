/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  CATEGORIES_ROUTE,
  DISCLAIMER_ROUTE,
  EVENTS_ROUTE,
  JPAL_TRACKING_ROUTE,
  LANDING_ROUTE,
  LOCAL_NEWS_TYPE,
  NEWS_ROUTE,
  POIS_ROUTE,
  RESERVED_CITY_CONTENT_SLUGS,
  SEARCH_ROUTE,
  TU_NEWS_TYPE,
} from '.'

import normalizePath from '../utils/normalizePath'
import { RouteInformationType } from './RouteInformationTypes'
import { parseQueryParams } from './query'

const ENTITY_ID_INDEX = 3

class InternalPathnameParser {
  _parts: string[]
  _length: number
  _fallbackLanguageCode: string
  _fixedCity: string | null
  _queryParams: URLSearchParams

  constructor(pathname: string, languageCode: string, fixedCity: string | null, query?: string) {
    this._fixedCity = fixedCity
    this._fallbackLanguageCode = languageCode
    this._parts = this.pathnameParts(normalizePath(pathname))
    this._length = this._parts.length
    this._queryParams = new URLSearchParams(query)
  }

  pathnameParts = (pathname: string): string[] => {
    const parts = pathname.split('/').filter(Boolean)
    const [first, second, ...rest] = parts

    const isLanguageIndependentUrl = !!first && !!second && RESERVED_CITY_CONTENT_SLUGS.includes(second)
    if (isLanguageIndependentUrl) {
      return [first, this._fallbackLanguageCode, second, ...rest]
    }

    return parts
  }

  isFixedCity = (): boolean => !!this._fixedCity && this._length >= 1 && this._parts[0] === this._fixedCity

  isCityContentFeatureRoute = (feature: string): boolean => this._length > 2 && this._parts[2] === feature

  languageCode = (): string => this._parts[1] ?? this._fallbackLanguageCode

  jpalTracking = (): RouteInformationType => {
    if (this._length > 0 && this._length <= 2 && this._parts[0] === JPAL_TRACKING_ROUTE) {
      const trackingCode = this._parts[1] ?? null
      return {
        route: JPAL_TRACKING_ROUTE,
        trackingCode,
      }
    }

    return null
  }

  landing = (): RouteInformationType => {
    // There is no landing route if there is a fixed city
    if (this._fixedCity) {
      return null
    }

    if (this._length === 0 || this._parts[0] === LANDING_ROUTE) {
      // '/', '/landing' or '/landing/de'
      return {
        route: LANDING_ROUTE,
        languageCode: this.languageCode(),
      }
    }

    return null
  }

  dashboard = (): RouteInformationType => {
    const fixedCity = this._fixedCity

    if (fixedCity) {
      // '/', '/landing', '/abapp' or '/abapp/'de'
      if (this._length <= 2 && (this._length === 0 || this.isFixedCity() || this._parts[0] === LANDING_ROUTE)) {
        const cityContentPath = `/${fixedCity}/${this.languageCode()}`
        return {
          route: CATEGORIES_ROUTE,
          cityCode: fixedCity,
          languageCode: this.languageCode(),
          cityContentPath,
        }
      }
    } else if (this._length > 0 && this._length <= 2 && this._parts[0] !== LANDING_ROUTE) {
      const cityCode = this._parts[0]!
      // '/ansbach/de', '/ansbach'
      const cityContentPath = `/${cityCode}/${this.languageCode()}`
      return {
        route: CATEGORIES_ROUTE,
        cityCode,
        languageCode: this.languageCode(),
        cityContentPath,
      }
    }

    return null
  }

  cityContentParams = (
    feature: string,
  ): {
    cityCode: string
    languageCode: string
  } | null => {
    if ((this._fixedCity && !this.isFixedCity()) || !this.isCityContentFeatureRoute(feature)) {
      return null
    }

    // '/augsburg/de/<feature>' or '/augsburg/de/<feature>/id'
    return {
      cityCode: this._parts[0]!,
      languageCode: this._parts[1]!,
    }
  }

  events = (): RouteInformationType => {
    const params = this.cityContentParams(EVENTS_ROUTE)

    if (!params) {
      return null
    }

    // Single events are identified via their slug, e.g. 'my-event-1234'
    const slug = this._length > ENTITY_ID_INDEX ? this._parts[this._length - 1] : undefined
    return { ...params, route: EVENTS_ROUTE, slug }
  }

  pois = (): RouteInformationType => {
    const params = this.cityContentParams(POIS_ROUTE)

    if (!params) {
      return null
    }

    // Single pois are identified via their slug, e.g. 'my-poi-1234'
    const slug = this._length > ENTITY_ID_INDEX ? this._parts[ENTITY_ID_INDEX] : undefined
    const { multipoi, poiCategoryId, zoom } = parseQueryParams(this._queryParams)

    return { ...params, route: POIS_ROUTE, slug, multipoi, poiCategoryId, zoom }
  }

  news = (): RouteInformationType => {
    const params = this.cityContentParams(NEWS_ROUTE)

    if (!params) {
      return null
    }

    // '/augsburg/de/news', '/augsburg/de/news/local', '/augsburg/de/news/tu-news', '/augsburg/de/news/local/id'
    const type = this._length > ENTITY_ID_INDEX ? this._parts[ENTITY_ID_INDEX] : undefined

    if (type && type !== LOCAL_NEWS_TYPE && type !== TU_NEWS_TYPE) {
      return null
    }

    const newsType = type === TU_NEWS_TYPE ? TU_NEWS_TYPE : LOCAL_NEWS_TYPE
    const newsId = this._length > ENTITY_ID_INDEX + 1 ? this._parts[ENTITY_ID_INDEX + 1] : undefined
    return {
      route: NEWS_ROUTE,
      cityCode: this._parts[0]!,
      languageCode: this._parts[1]!,
      newsType,
      newsId: newsId ? parseInt(newsId, 10) : undefined,
    }
  }

  disclaimer = (): RouteInformationType => {
    const params = this.cityContentParams(DISCLAIMER_ROUTE)

    if (!params) {
      return null
    }

    return {
      route: DISCLAIMER_ROUTE,
      ...params,
    }
  }

  search = (): RouteInformationType => {
    const params = this.cityContentParams(SEARCH_ROUTE)

    if (!params) {
      return null
    }

    return {
      route: SEARCH_ROUTE,
      searchText: parseQueryParams(this._queryParams).searchText,
      ...params,
    }
  }

  categories = (): RouteInformationType => {
    if (this._fixedCity && !this.isFixedCity()) {
      return null
    }

    if (this._length > 2 && !RESERVED_CITY_CONTENT_SLUGS.includes(this._parts[2]!)) {
      return {
        route: CATEGORIES_ROUTE,
        cityCode: this._parts[0]!,
        languageCode: this._parts[1]!,
        cityContentPath: `/${this._parts.join('/')}`,
      }
    }

    return null
  }

  route = (): RouteInformationType =>
    this.landing() ||
    this.jpalTracking() ||
    this.events() ||
    this.pois() ||
    this.disclaimer() ||
    this.news() ||
    this.search() ||
    this.dashboard() ||
    this.categories()
}

export default InternalPathnameParser
