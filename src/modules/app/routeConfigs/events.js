// @flow

import React from 'react'
import type { AllPayloadsType, GetLanguageChangePathParamsType, GetPageTitleParamsType } from './types'
import Payload from '../../endpoint/Payload'
import EventModel from '../../endpoint/models/EventModel'
import RouteConfig from './RouteConfig'
import EventsPage from '../../../routes/events/containers/EventsPage'
import type { Route } from 'redux-first-router'

type RequiredPayloadType = {|events: Payload<Array<EventModel>>|}
type EventsRouteParamsType = {|city: string, language: string|}

export const EVENTS_ROUTE = 'EVENTS'

const getEventsPath = ({city, language}: EventsRouteParamsType): string => `/${city}/${language}/events`

/**
 * EventsRoute, matches /augsburg/de/events and /augsburg/de/events/begegnungscafe
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
const eventsRoute: Route = '/:city/:language/events/:eventId?'

const renderPage = ({ events }: RequiredPayloadType) =>
  <EventsPage events={events.data} />

const getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadType =>
  ({ events: payloads.eventsPayload })

const getLanguageChangePath = ({location, events, language}: GetLanguageChangePathParamsType) => {
  const {city, eventId} = location.payload
  if (events && eventId) {
    const event = events.find(_event => _event.path === location.pathname)
    return (event && event.availableLanguages.get(language)) || null
  }
  return getEventsPath({city, language})
}

const getPageTitle = ({t, events, cityName, pathname}: GetPageTitleParamsType) => {
  const event = events && events.find(event => event.path === pathname)
  return `${event ? event.title : t('pageTitles.events')} - ${cityName}`
}

class EventsRouteConfig extends RouteConfig<RequiredPayloadType, EventsRouteParamsType> {
  constructor () {
    super({
      name: EVENTS_ROUTE,
      route: eventsRoute,
      getRoutePath: getEventsPath,
      getRequiredPayloads,
      getLanguageChangePath,
      getPageTitle
    })
  }
}

export default EventsRouteConfig
