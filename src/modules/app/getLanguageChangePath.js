import CategoriesMapModel from '../endpoint/models/CategoriesMapModel'
import { EXTRAS_ROUTE, getExtraPath } from './routes/extras'
import { DISCLAIMER_ROUTE, getDisclaimerPath } from './routes/disclaimer'
import { EVENTS_ROUTE, getEventPath } from './routes/events'
import { getSearchPath, SEARCH_ROUTE } from './routes/search'
import { CATEGORIES_ROUTE, getCategoryPath } from './routes/categories'
import EventModel from '../endpoint/models/EventModel'

import type { Location } from 'redux-first-router/dist/flow-types'

/**
 * Maps the given languageCode to an action to go to the current route in the language specified by languageCode
 */
const getLanguageChangePath = (params: {| location: Location, categories: CategoriesMapModel,
  events: Array<EventModel>, languageCode: string |}) => {
  const {location, categories, events, languageCode} = params
  const {city, eventId, extraAlias, language} = location.payload
  const routeType = location.type

  switch (routeType) {
    case CATEGORIES_ROUTE:
      if (categories) {
        const category = categories.findCategoryByPath(location.pathname)
        if (category && category.id !== 0) {
          const path = category.availableLanguages.get(languageCode)
          if (path) {
            return path
          } else if (language === languageCode) {
            return location.pathname
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
          return getEventPath(city, languageCode, event.availableLanguages[languageCode])
        }
      }
      return getEventPath(city, languageCode)
    case EXTRAS_ROUTE:
      return getExtraPath(city, languageCode, extraAlias)
    case DISCLAIMER_ROUTE:
      return getDisclaimerPath(city, languageCode)
    case SEARCH_ROUTE:
      return getSearchPath(city, languageCode)
  }
}

export default getLanguageChangePath
