// @flow

import { createAction } from 'redux-actions'
import type { Route as RouterRouteType, Location, Action } from 'redux-first-router'
import EventModel from '../../endpoint/models/EventModel'
import CityModel from '../../endpoint/models/CityModel'
import EventsPage from '../../../routes/events/containers/EventsPage'
import React from 'react'
import type { AllPayloadsType } from './types'
import Route from './Route'
import Payload from '../../endpoint/Payload'

type RequiredPayloadType = {|events: Payload<Array<EventModel>>, cities: Payload<Array<CityModel>>|}

const name = 'EVENTS'

 const goToRoute = (city: string, language: string): Action => createAction<string, { city: string, language: string }>(name)({city, language})

const getRoutePath = (city: string, language: string): string => `/${city}/${language}/events`

const renderPage = ({ events, cities }: RequiredPayloadType) =>
  <EventsPage events={events} cities={cities} />

const getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadType =>
  ({ events: payloads.eventsPayload, cities: payloads.citiesPayload })

/**
 * EventsRoute, matches /augsburg/de/events and /augsburg/de/events/begegnungscafe
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
const route: RouterRouteType = '/:city/:language/events/:eventId?'

export default new Route<RequiredPayloadType, city: string, language: string>({
  name,
  goToRoute,
  renderPage,
  route,
  getRequiredPayloads
})
