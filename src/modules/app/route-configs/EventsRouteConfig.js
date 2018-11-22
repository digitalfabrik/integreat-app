// @flow

import { RouteConfigInterface } from './RouteConfigInterface'
import type { Route } from 'redux-first-router'
import type { AllPayloadsType, GetLanguageChangePathParamsType, GetPageTitleParamsType } from './RouteConfigInterface'
import Payload from '../../endpoint/Payload'
import EventModel from '../../endpoint/models/EventModel'

type EventsRouteParamsType = {|city: string, language: string|}
type RequiredPayloadsType = {|events: Payload<Array<EventModel>>|}

export const EVENTS_ROUTE = 'EVENTS'

/**
 * EventsRoute, matches /augsburg/de/events and /augsburg/de/events/begegnungscafe
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
const eventsRoute: Route = '/:city/:language/events/:eventId?'

class EventsRouteConfig implements RouteConfigInterface<EventsRouteParamsType, RequiredPayloadsType> {
  name = EVENTS_ROUTE
  route = eventsRoute

  getLanguageChangePath = ({location, events, language}: GetLanguageChangePathParamsType) => {
    const {city, eventId} = location.payload
    if (events && eventId) {
      const event = events.find(_event => _event.path === location.pathname)
      return (event && event.availableLanguages.get(language)) || null
    }
    return this.getRoutePath({city, language})
  }

  getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadsType => ({events: payloads.eventsPayload})

  getPageTitle = ({t, events, cityName, pathname}: GetPageTitleParamsType) => {
    const event = events && events.find(event => event.path === pathname)
    return `${event ? event.title : t('pageTitles.events')} - ${cityName}`
  }

  getRoutePath = ({city, language}: EventsRouteParamsType): string => `/${city}/${language}/events`
}

export default EventsRouteConfig
