// @flow

import type { Route as RouterRouteType } from 'redux-first-router'
import EventModel from '../../endpoint/models/EventModel'
import CityModel from '../../endpoint/models/CityModel'
import EventsPage from '../../../routes/events/containers/EventsPage'
import React from 'react'
import type { AllPayloadsType } from './types'
import Route from './Route'
import Payload from '../../endpoint/Payload'

type RequiredPayloadType = {|events: Payload<Array<EventModel>>, cities: Payload<Array<CityModel>>|}
type RouteParamsType = {|city: string, language: string|}

export const EVENTS_ROUTE = 'EVENTS'

const getRoutePath = ({city, language}: RouteParamsType): string => `/${city}/${language}/events`

const renderPage = ({ events, cities }: RequiredPayloadType) =>
  <EventsPage events={events.data} cities={cities.data} />

const getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadType =>
  ({ events: payloads.eventsPayload, cities: payloads.citiesPayload })

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
  getRequiredPayloads
})

export default eventsRoute
