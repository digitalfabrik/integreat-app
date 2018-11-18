// @flow

import React from 'react'
import { EVENTS_ROUTE, getEventsPath } from '../events'
import type { AllPayloadsType, GetLanguageChangePathParamsType, GetPageTitleParamsType } from '../types'
import Payload from '../../../endpoint/Payload'
import EventModel from '../../../endpoint/models/EventModel'
import RouteConfig from './RouteConfig'
import EventsPage from '../../../../routes/events/containers/EventsPage'

type RequiredPayloadType = {|events: Payload<Array<EventModel>>|}

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

const eventsRouteConfig: RouteConfig<RequiredPayloadType> = new RouteConfig({
  name: EVENTS_ROUTE,
  renderPage,
  getRequiredPayloads,
  getLanguageChangePath,
  getPageTitle
})

export default eventsRouteConfig
