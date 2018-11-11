// @flow

import { createAction } from 'redux-actions'
import type { Route as RouterRouteType, Location } from 'redux-first-router'
import EventModel from '../../endpoint/models/EventModel'
import CityModel from '../../endpoint/models/CityModel'
import EventsPage from '../../../routes/events/containers/EventsPage'
import React from 'react'
import type { AllPayloadsType } from './types'
import Route from './Route'
import Payload from '../../endpoint/Payload'

const name = 'EVENTS'

const goToRoute = (city: string, language: string) => createAction(name)({city, language})

const getRoutePath = (city: string, language: string): string => `/${city}/${language}/events`

const renderPage = ({events, cities}: {|events: Payload<Array<EventModel>>, cities: Payload<Array<CityModel>>|}) =>
  <EventsPage events={events} cities={cities} />

const getLanguageChangePath = ({events, location, language, city}: {events: Array<EventModel>,
  language: string, location: Location, city: string}) => {
  const {eventId} = location.payload
  if (events && eventId) {
    const event = events.find(_event => _event.path === location.pathname)
    return (event && event.availableLanguages.get(language)) || null
  }
  return getRoutePath(city, language)
}

const getRequiredPayloads = (payloads: AllPayloadsType) =>
  ({events: payloads.eventsPayload, cities: payloads.citiesPayload})

/**
 * EventsRoute, matches /augsburg/de/events and /augsburg/de/events/begegnungscafe
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
const route: RouterRouteType = '/:city/:language/events/:eventId?'

export default new Route({name, goToRoute, getRoutePath, renderPage, getLanguageChangePath, route, getRequiredPayloads})
