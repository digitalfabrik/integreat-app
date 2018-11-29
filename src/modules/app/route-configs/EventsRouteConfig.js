// @flow

import { RouteConfig } from './RouteConfig'
import type { Route } from 'redux-first-router'
import type {
  AllPayloadsType,
  GetFeedbackReferenceType,
  GetLanguageChangePathParamsType,
  GetPageTitleParamsType
} from './RouteConfig'
import { Payload, EventModel } from '@integreat-app/integreat-api-client'

type EventsRouteParamsType = {|city: string, language: string|}
type RequiredPayloadsType = {|events: Payload<Array<EventModel>>|}

export const EVENTS_ROUTE = 'EVENTS'

/**
 * EventsRoute, matches /augsburg/de/events and /augsburg/de/events/begegnungscafe
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
const eventsRoute: Route = '/:city/:language/events/:eventId?'

class EventsRouteConfig implements RouteConfig<EventsRouteParamsType, RequiredPayloadsType> {
  name = EVENTS_ROUTE
  route = eventsRoute
  isLocationLayoutRoute = true
  requiresHeader = true
  requiresFooter = true

  getLanguageChangePath = ({location, payloads, language}: GetLanguageChangePathParamsType<RequiredPayloadsType>) => {
    const {city, eventId} = location.payload
    const events = payloads.events.data
    if (events && eventId) {
      const event = events.find(_event => _event.path === location.pathname)
      return (event && event.availableLanguages.get(language)) || null
    }
    return this.getRoutePath({city, language})
  }

  getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadsType => ({events: payloads.eventsPayload})

  getPageTitle = ({t, payloads, cityName, location}: GetPageTitleParamsType<RequiredPayloadsType>) => {
    const pathname = location.pathname
    const events = payloads.events.data
    const event = events && events.find(event => event.path === pathname)
    return `${event ? event.title : t('pageTitles.events')} - ${cityName}`
  }

  getRoutePath = ({city, language}: EventsRouteParamsType): string => `/${city}/${language}/events`

  getMetaDescription = () => null

  getFeedbackReference = ({payloads, location}: GetFeedbackReferenceType<RequiredPayloadsType>) => {
    const events = payloads.events.data
    const event = events && events.find(event => event.id === location.payload.eventId)
    return event ? {id: event.id, title: event.title} : null
  }
}

export default EventsRouteConfig
