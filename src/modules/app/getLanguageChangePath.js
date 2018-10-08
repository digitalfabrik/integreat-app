// @flow

import CategoriesMapModel from '../endpoint/models/CategoriesMapModel'
import { EXTRAS_ROUTE, getExtraPath } from './routes/extras'
import { DISCLAIMER_ROUTE, getDisclaimerPath } from './routes/disclaimer'
import { EVENTS_ROUTE, getEventPath } from './routes/events'
import { getSearchPath, SEARCH_ROUTE } from './routes/search'
import { CATEGORIES_ROUTE, getCategoryPath } from './routes/categories'
import EventModel from '../endpoint/models/EventModel'

import type { Location } from 'redux-first-router'
import { getWohnenExtraPath, WOHNEN_ROUTE } from './routes/wohnen'
import { getSprungbrettExtraPath, SPRUNGBRETT_ROUTE } from './routes/sprungbrett'
import { getPoisPath, POIS_ROUTE } from './routes/pois'
import PoiModel from '../endpoint/models/PoiModel'

/**
 * Maps the given languageCode to an action to go to the current route in the language specified by languageCode
 */
const getLanguageChangePath = ({location, categories, events, pois, languageCode}: {|
  location: Location,
  categories: ?CategoriesMapModel,
  events: ?Array<EventModel>,
  pois: ?Array<PoiModel>,
  languageCode: string
|}): string | null => {
  const {payload, pathname, type} = location
  const {city, eventId, extraAlias, language, poiId} = payload

  switch (type) {
    case CATEGORIES_ROUTE:
      if (categories) {
        const category = categories.findCategoryByPath(location.pathname)
        if (category && category.id !== 0) {
          const path = category.availableLanguages.get(languageCode)
          if (path) {
            return path
          } else if (language === languageCode) {
            return pathname
          } else {
            return null
          }
        }
      }
      return getCategoryPath(city, languageCode)
    case EVENTS_ROUTE:
      if (events && eventId) {
        const event = events.find(_event => _event.id === eventId)
        if (event) {
          const eventId = event.availableLanguages.get(languageCode)
          if (!eventId) {
            return null
          }

          return getEventPath(city, languageCode, eventId)
        }
      }
      return getEventPath(city, languageCode)
    case POIS_ROUTE:
      if (pois && poiId) {
        const poi = pois.find(_poi => _poi.path === pathname)
        if (!poi) {
          return null
        }
        return poi.availableLanguages.get(languageCode) || null
      }
      return getPoisPath(city, languageCode)
    case EXTRAS_ROUTE:
      return getExtraPath(city, languageCode, extraAlias)
    case DISCLAIMER_ROUTE:
      return getDisclaimerPath(city, languageCode)
    case SEARCH_ROUTE:
      return getSearchPath(city, languageCode)
    case WOHNEN_ROUTE:
      return getWohnenExtraPath(city, languageCode)
    case SPRUNGBRETT_ROUTE:
      return getSprungbrettExtraPath(city, languageCode)
    default:
      return null
  }
}

export default getLanguageChangePath
