/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  CATEGORIES_ROUTE,
  IMPRINT_ROUTE,
  EVENTS_ROUTE,
  LANDING_ROUTE,
  LOCAL_NEWS_TYPE,
  NEWS_ROUTE,
  POIS_ROUTE,
  RESERVED_REGION_CONTENT_SLUGS,
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
  _fixedRegion: string | null
  _queryParams: URLSearchParams

  constructor(pathname: string, languageCode: string, fixedRegion: string | null, query?: string) {
    this._fixedRegion = fixedRegion
    this._fallbackLanguageCode = languageCode
    this._parts = this.pathnameParts(normalizePath(pathname))
    this._length = this._parts.length
    this._queryParams = new URLSearchParams(query)
  }

  pathnameParts = (pathname: string): string[] => {
    const parts = pathname.split('/').filter(Boolean)
    const [first, second, ...rest] = parts

    const isLanguageIndependentUrl = !!first && !!second && RESERVED_REGION_CONTENT_SLUGS.includes(second)
    if (isLanguageIndependentUrl) {
      return [first, this._fallbackLanguageCode, second, ...rest]
    }

    return parts
  }

  isFixedRegion = (): boolean => !!this._fixedRegion && this._length >= 1 && this._parts[0] === this._fixedRegion

  isRegionContentFeatureRoute = (feature: string): boolean => this._length > 2 && this._parts[2] === feature

  languageCode = (): string => this._parts[1] ?? this._fallbackLanguageCode

  landing = (): RouteInformationType => {
    // There is no landing route if there is a fixed region
    if (this._fixedRegion) {
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
    const fixedRegion = this._fixedRegion

    if (fixedRegion) {
      // '/', '/landing', '/abapp' or '/abapp/'de'
      if (this._length <= 2 && (this._length === 0 || this.isFixedRegion() || this._parts[0] === LANDING_ROUTE)) {
        const regionContentPath = `/${fixedRegion}/${this.languageCode()}`
        return {
          route: CATEGORIES_ROUTE,
          regionCode: fixedRegion,
          languageCode: this.languageCode(),
          regionContentPath,
        }
      }
    } else if (this._length > 0 && this._length <= 2 && this._parts[0] !== LANDING_ROUTE) {
      const regionCode = this._parts[0]!
      // '/ansbach/de', '/ansbach'
      const regionContentPath = `/${regionCode}/${this.languageCode()}`
      return {
        route: CATEGORIES_ROUTE,
        regionCode,
        languageCode: this.languageCode(),
        regionContentPath,
      }
    }

    return null
  }

  regionContentParams = (
    feature: string,
  ): {
    regionCode: string
    languageCode: string
  } | null => {
    if ((this._fixedRegion && !this.isFixedRegion()) || !this.isRegionContentFeatureRoute(feature)) {
      return null
    }

    // '/augsburg/de/<feature>' or '/augsburg/de/<feature>/id'
    return {
      regionCode: this._parts[0]!,
      languageCode: this._parts[1]!,
    }
  }

  events = (): RouteInformationType => {
    const params = this.regionContentParams(EVENTS_ROUTE)

    if (!params) {
      return null
    }

    // Single events are identified via their slug, e.g. 'my-event-1234'
    const slug = this._length > ENTITY_ID_INDEX ? this._parts[this._length - 1] : undefined
    return { ...params, route: EVENTS_ROUTE, slug }
  }

  pois = (): RouteInformationType => {
    const params = this.regionContentParams(POIS_ROUTE)

    if (!params) {
      return null
    }

    // Single pois are identified via their slug, e.g. 'my-poi-1234'
    const slug = this._length > ENTITY_ID_INDEX ? this._parts[ENTITY_ID_INDEX] : undefined
    const { multipoi, poiCategoryId, zoom } = parseQueryParams(this._queryParams)

    return { ...params, route: POIS_ROUTE, slug, multipoi, poiCategoryId, zoom }
  }

  news = (): RouteInformationType => {
    const params = this.regionContentParams(NEWS_ROUTE)

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
      regionCode: this._parts[0]!,
      languageCode: this._parts[1]!,
      newsType,
      newsId: newsId ? parseInt(newsId, 10) : undefined,
    }
  }

  imprint = (): RouteInformationType => {
    const params = this.regionContentParams(IMPRINT_ROUTE)

    if (!params) {
      return null
    }

    return {
      route: IMPRINT_ROUTE,
      ...params,
    }
  }

  search = (): RouteInformationType => {
    const params = this.regionContentParams(SEARCH_ROUTE)

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
    if (this._fixedRegion && !this.isFixedRegion()) {
      return null
    }

    if (this._length > 2 && !RESERVED_REGION_CONTENT_SLUGS.includes(this._parts[2]!)) {
      return {
        route: CATEGORIES_ROUTE,
        regionCode: this._parts[0]!,
        languageCode: this._parts[1]!,
        regionContentPath: `/${this._parts.join('/')}`,
      }
    }

    return null
  }

  route = (): RouteInformationType =>
    this.landing() ||
    this.events() ||
    this.pois() ||
    this.imprint() ||
    this.news() ||
    this.search() ||
    this.dashboard() ||
    this.categories()
}

export default InternalPathnameParser
