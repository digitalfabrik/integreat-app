// @flow

import { createAction } from 'redux-actions'
import type { Route } from 'redux-first-router'
import EventModel from '../../endpoint/models/EventModel'
import CityModel from '../../endpoint/models/CityModel'
import EventsPage from '../../../routes/events/containers/EventsPage'
import React from 'react'

export const EVENTS_ROUTE = 'EVENTS'

export const goToEvents = (city: string, language: string) => createAction(EVENTS_ROUTE)({city, language})

export const getEventsPath = (city: string, language: string): string => `/${city}/${language}/events`

export const renderEventsPage = (props: {|events: Array<EventModel>, cities: Array<CityModel>|}) =>
  <EventsPage {...props} />

/**
 * EventsRoute, matches /augsburg/de/events and /augsburg/de/events/begegnungscafe
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
export const eventsRoute: Route = '/:city/:language/events/:eventId?'
