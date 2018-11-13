// @flow

import type { Route as RouterRouteType } from 'redux-first-router'
import EventModel from '../../endpoint/models/EventModel'
import EventsPage from '../../../routes/events/containers/EventsPage'
import React from 'react'
import type { AllPayloadsType, GetLanguageChangePathParamsType, GetPageTitleParamsType } from './types'
import Route from './Route'
import Payload from '../../endpoint/Payload'

type RequiredPayloadType = {|events: Payload<Array<EventModel>>|}
type RouteParamsType = {|city: string, language: string|}

export const EVENTS_ROUTE = 'EVENTS'

const getRoutePath = ({city, language}: RouteParamsType): string => `/${city}/${language}/events`

const renderPage = ({ events }: RequiredPayloadType) =>
  <EventsPage events={events.data} />

const getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadType =>
  ({ events: payloads.eventsPayload })

const getLanguageChangePath = ({location, events}: GetLanguageChangePathParamsType) => {
  const {city, language, eventId} = location.payload
  if (events && eventId) {
    const event = events.find(_event => _event.path === location.pathname)
    return (event && event.availableLanguages.get(language)) || null
  }
  return eventsRoute.getRoutePath({city, language})
}

const getPageTitle = ({t, events, cityName, pathname}: GetPageTitleParamsType) => {
  const event = events && events.find(event => event.path === pathname)
  return `${event ? event.title : t('pageTitle')} - ${cityName}`
}

/**
 * EventsRoute, matches /augsburg/de/events and /augsburg/de/events/begegnungscafe
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
const route: RouterRouteType = '/:city/:language/events/:eventId?'

const eventsRoute: Route<RequiredPayloadType, RouteParamsType> = new Route({
  name: EVENTS_ROUTE,
  getRoutePath,
  renderPage,
  route,
  getRequiredPayloads,
  getLanguageChangePath,
  getPageTitle
})

export default eventsRoute
