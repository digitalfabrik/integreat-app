// @flow

import CategoriesMapModel from '../endpoint/models/CategoriesMapModel'
import extrasRoute, { EXTRAS_ROUTE } from './routes/extras'
import disclaimerRoute, { DISCLAIMER_ROUTE } from './routes/disclaimer'
import eventsRoute, { EVENTS_ROUTE } from './routes/events'
import searchRoute, { SEARCH_ROUTE } from './routes/search'
import categoriesRoute, { CATEGORIES_ROUTE } from './routes/categories'
import EventModel from '../endpoint/models/EventModel'

import type { Location } from 'redux-first-router'
import wohnenRoute, { WOHNEN_ROUTE } from './routes/wohnen'
import sprungbrettRoute, { SPRUNGBRETT_ROUTE } from './routes/sprungbrett'
import poisRoute, { POIS_ROUTE } from './routes/pois'
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
  const {city, eventId, language, poiId} = payload

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
      return categoriesRoute.getRoutePath({city, language: languageCode})
    case EVENTS_ROUTE:
      if (events && eventId) {
        const event = events.find(_event => _event.path === pathname)
        if (!event) {
          return null
        }
        return event.availableLanguages.get(languageCode) || null
      }
      return eventsRoute.getRoutePath({city, language: languageCode})
    case POIS_ROUTE:
      if (pois && poiId) {
        const poi = pois.find(_poi => _poi.path === pathname)
        if (!poi) {
          return null
        }
        return poi.availableLanguages.get(languageCode) || null
      }
      return poisRoute.getRoutePath({city, language: languageCode})
    case EXTRAS_ROUTE:
      return extrasRoute.getRoutePath({city, language: languageCode})
    case DISCLAIMER_ROUTE:
      return disclaimerRoute.getRoutePath({city, language: languageCode})
    case SEARCH_ROUTE:
      return searchRoute.getRoutePath({city, language: languageCode})
    case WOHNEN_ROUTE:
      return wohnenRoute.getRoutePath({city, language: languageCode})
    case SPRUNGBRETT_ROUTE:
      return sprungbrettRoute.getRoutePath({city, language: languageCode})
    default:
      return null
  }
}

export default getLanguageChangePath
