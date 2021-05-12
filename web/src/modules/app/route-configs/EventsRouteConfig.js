// @flow

import type { AllPayloadsType } from './RouteConfig'
import { RouteConfig } from './RouteConfig'
import type { Route } from 'redux-first-router'
import {
  CityModel,
  createCitiesEndpoint,
  createEventsEndpoint,
  createLanguagesEndpoint,
  EventModel,
  Payload
} from 'api-client'
import fetchData from '../fetchData'
import { cmsApiBaseUrl } from '../constants/urls'
import type { StateType } from '../StateType'

type EventsRouteParamsType = {| city: string, language: string |}
type RequiredPayloadsType = {| events: Payload<Array<EventModel>>, cities: Payload<Array<CityModel>> |}

export const EVENTS_ROUTE = 'EVENTS'

/**
 * EventsRoute, matches /augsburg/de/events and /augsburg/de/events/begegnungscafe
 * @type {{path: string, thunk: function(dispatch, getState)}}
 */
const eventsRoute: Route = {
  path: '/:city/:language/events/:eventId?',
  thunk: async (dispatch, getState) => {
    const state: StateType = getState()
    const { city, language } = state.location.payload

    await Promise.all([
      fetchData(createCitiesEndpoint(cmsApiBaseUrl), dispatch, state.cities),
      fetchData(createEventsEndpoint(cmsApiBaseUrl), dispatch, state.events, { city, language }),
      fetchData(createLanguagesEndpoint(cmsApiBaseUrl), dispatch, state.languages, { city, language })
    ])
  }
}

class EventsRouteConfig implements RouteConfig<EventsRouteParamsType, RequiredPayloadsType> {
  name = EVENTS_ROUTE
  route = eventsRoute
  isLocationLayoutRoute = true
  requiresHeader = true
  requiresFooter = true

  getLanguageChangePath = ({ location, payloads, language }) => {
    const { city, eventId } = location.payload
    const events = payloads.events.data
    if (events && eventId) {
      const event = events.find(_event => _event.path === location.pathname)
      return (event && event.availableLanguages.get(language)) || null
    }
    return this.getRoutePath({ city, language })
  }

  getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadsType => ({
    cities: payloads.citiesPayload,
    events: payloads.eventsPayload
  })

  getPageTitle = ({ t, payloads, location }) => {
    const city = payloads.cities.data && payloads.cities.data.find(_city => _city.code === location.payload.city)
    if (!city || !city.eventsEnabled) {
      return null
    }
    const pathname = location.pathname
    const events = payloads.events.data
    const event = events && events.find(event => event.path === pathname)
    return `${event ? event.title : t('pageTitles.events')} - ${city.name}`
  }

  getRoutePath = ({ city, language }: EventsRouteParamsType): string => `/${city}/${language}/events`

  getMetaDescription = () => null

  getFeedbackTargetInformation = ({ payloads, location }) => {
    const events = payloads.events.data
    const event = events && events.find(event => event.path === location.pathname)
    return event ? { path: event.path } : null
  }
}

export default EventsRouteConfig
