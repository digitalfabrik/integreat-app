import {
  CATEGORIES_ROUTE,
  DASHBOARD_ROUTE,
  DISCLAIMER_ROUTE,
  EVENTS_ROUTE,
  JPAL_TRACKING_ROUTE,
  LANDING_ROUTE,
  LOCAL_NEWS_TYPE,
  LocalNewsType,
  NEWS_ROUTE,
  OFFERS_ROUTE,
  POIS_ROUTE,
  SEARCH_ROUTE,
  SPRUNGBRETT_OFFER_ROUTE,
  TU_NEWS_TYPE,
  TuNewsType
} from './'
import { RouteInformationType } from './RouteInformationTypes'
import normalizePath from '../normalizePath'

const ENTITY_ID_INDEX = 3

class InternalPathnameParser {
  _pathname: string
  _parts: Array<string>
  _length: number
  _fallbackLanguageCode: string
  _fixedCity: string | null

  constructor(pathname: string, languageCode: string, fixedCity: string | null) {
    this._pathname = normalizePath(pathname)
    this._fixedCity = fixedCity
    this._parts = this.pathnameParts(pathname)
    this._length = this._parts.length
    this._fallbackLanguageCode = languageCode
  }

  pathnameParts = (pathname: string): string[] => {
    return pathname.split('/').filter(Boolean)
  }

  isFixedCity = (): boolean => {
    return !!this._fixedCity && this._length >= 1 && this._parts[0] === this._fixedCity
  }

  isCityContentFeatureRoute = (feature: string): boolean => {
    return this._length > 2 && this._parts[2] === feature
  }

  languageCode = (): string => {
    return this._length >= 2 ? this._parts[1] : this._fallbackLanguageCode
  }

  jpalTracking = (): RouteInformationType => {
    if (this._length > 0 && this._length <= 2 && this._parts[0] === JPAL_TRACKING_ROUTE) {
      const trackingCode = this._length === 2 ? this._parts[1] : null
      return {
        route: JPAL_TRACKING_ROUTE,
        trackingCode
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
        languageCode: this.languageCode()
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
          route: DASHBOARD_ROUTE,
          cityCode: fixedCity,
          languageCode: this.languageCode(),
          cityContentPath
        }
      }
    } else if (this._length > 0 && this._length <= 2 && this._parts[0] !== LANDING_ROUTE) {
      // '/ansbach/de', '/ansbach'
      const cityContentPath = `/${this._parts[0]}/${this.languageCode()}`
      return {
        route: DASHBOARD_ROUTE,
        cityCode: this._parts[0],
        languageCode: this.languageCode(),
        cityContentPath
      }
    }

    return null
  }

  cityContentParams = (
    feature: string
  ): {
    cityCode: string
    languageCode: string
  } | null => {
    if ((this._fixedCity && !this.isFixedCity()) || !this.isCityContentFeatureRoute(feature)) {
      return null
    }

    // '/augsburg/de/<feature>' or '/augsburg/de/<feature>/id'
    return {
      cityCode: this._parts[0],
      languageCode: this._parts[1]
    }
  }

  events = (): RouteInformationType => {
    const params = this.cityContentParams(EVENTS_ROUTE)

    if (!params) {
      return null
    }

    // Single events are identified via their city content path, e.g. '/augsburg/de/events/1234'
    const cityContentPath = this._length > ENTITY_ID_INDEX ? this._pathname : undefined
    return { ...params, route: EVENTS_ROUTE, cityContentPath }
  }

  pois = (): RouteInformationType => {
    const params = this.cityContentParams(POIS_ROUTE)

    if (!params) {
      return null
    }

    // Single pois are identified via their city content path, e.g. '/augsburg/de/events/1234'
    const cityContentPath = this._length > ENTITY_ID_INDEX ? this._pathname : undefined
    return { ...params, route: POIS_ROUTE, cityContentPath }
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

    const newsType: LocalNewsType | TuNewsType = type === TU_NEWS_TYPE ? TU_NEWS_TYPE : LOCAL_NEWS_TYPE
    const newsId = this._length > ENTITY_ID_INDEX + 1 ? this._parts[ENTITY_ID_INDEX + 1] : undefined
    return {
      route: NEWS_ROUTE,
      cityCode: this._parts[0],
      languageCode: this._parts[1],
      newsType,
      newsId
    }
  }

  offers = (): RouteInformationType => {
    const params = this.cityContentParams(OFFERS_ROUTE)
    const route = this._length > ENTITY_ID_INDEX ? this._parts[ENTITY_ID_INDEX] : OFFERS_ROUTE

    if (params) {
      if (route === OFFERS_ROUTE) {
        return {
          route: OFFERS_ROUTE,
          ...params
        }
      } else if (route === SPRUNGBRETT_OFFER_ROUTE) {
        return {
          route: SPRUNGBRETT_OFFER_ROUTE,
          ...params
        }
      }
    }

    return null
  }

  disclaimer = (): RouteInformationType => {
    const params = this.cityContentParams(DISCLAIMER_ROUTE)

    if (!params) {
      return null
    }

    return {
      route: DISCLAIMER_ROUTE,
      ...params
    }
  }

  search = (): RouteInformationType => {
    const params = this.cityContentParams(SEARCH_ROUTE)

    if (!params) {
      return null
    }

    return {
      route: SEARCH_ROUTE,
      ...params
    }
  }

  categories = (): RouteInformationType => {
    if (this._fixedCity && !this.isFixedCity()) {
      return null
    }

    if (
      this._length > 2 &&
      !([SEARCH_ROUTE, DISCLAIMER_ROUTE, POIS_ROUTE, EVENTS_ROUTE, OFFERS_ROUTE, NEWS_ROUTE] as string[]).includes(
        this._parts[2]
      )
    ) {
      return {
        route: CATEGORIES_ROUTE,
        cityCode: this._parts[0],
        languageCode: this._parts[1],
        cityContentPath: this._pathname
      }
    }

    return null
  }

  route = (): RouteInformationType => {
    return (
      this.landing() ||
      this.jpalTracking() ||
      this.events() ||
      this.pois() ||
      this.offers() ||
      this.disclaimer() ||
      this.news() ||
      this.search() ||
      this.dashboard() ||
      this.categories()
    )
  }
}

export default InternalPathnameParser
