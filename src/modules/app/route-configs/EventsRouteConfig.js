// @flow

import RouteConfig from './RouteConfig'
import type { Route } from 'redux-first-router'
import type { AllPayloadsType, GetLanguageChangePathParamsType, GetPageTitleParamsType } from './RouteConfig'
import Payload from '../../endpoint/Payload'
import EventModel from '../../endpoint/models/EventModel'

type EventsRouteParamsType = {|city: string, language: string|}
type RequiredPayloadsType = {|events: Payload<Array<EventModel>>|}

export const EVENTS_ROUTE = 'EVENTS'

const getEventsPath = ({city, language}: EventsRouteParamsType): string => `/${city}/${language}/events`

/**
 * EventsRoute, matches /augsburg/de/events and /augsburg/de/events/begegnungscafe
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
const eventsRoute: Route = '/:city/:language/events/:eventId?'

const getLanguageChangePath = ({location, events, language}: GetLanguageChangePathParamsType) => {
  const {city, eventId} = location.payload
  if (events && eventId) {
    const event = events.find(_event => _event.path === location.pathname)
    return (event && event.availableLanguages.get(language)) || null
  }
  return getEventsPath({city, language})
}

const getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadsType => ({events: payloads.eventsPayload})

const getPageTitle = ({t, events, cityName, pathname}: GetPageTitleParamsType) => {
  const event = events && events.find(event => event.path === pathname)
  return `${event ? event.title : t('pageTitles.events')} - ${cityName}`
}

class EventsRouteConfig extends RouteConfig<EventsRouteParamsType, RequiredPayloadsType> {
  constructor () {
    super({
      name: EVENTS_ROUTE,
      route: eventsRoute,
      getRoutePath: getEventsPath,
      getLanguageChangePath,
      getPageTitle,
      getRequiredPayloads
    })
  }
}

export default EventsRouteConfig
