import { decodeHTML } from 'entities'
import { mapValues } from 'lodash'

import { DateTime } from 'luxon'
import { RRule, rrulestr } from 'rrule'

import Endpoint from '../Endpoint'
import EndpointBuilder from '../EndpointBuilder'
import mapAvailableLanguages from '../mapAvailableLanguages'
import DateModel from '../models/DateModel'
import EventModel from '../models/EventModel'
import FeaturedImageModel from '../models/FeaturedImageModel'
import LocationModel from '../models/LocationModel'
import { JsonEventType } from '../types'

export const EVENTS_ENDPOINT_NAME = 'events'
type ParamsType = {
  city: string
  language: string
}

const MAX_FUTURE_EVENT_IN_MONTHS = 6
const MAX_NUMBERS_OF_RECURRING_EVENTS = 10

const eventCompare = (event1: EventModel, event2: EventModel): number => {
  if (event1.date.startDate < event2.date.startDate) {
    return -1
  }

  if (event1.date.startDate > event2.date.startDate) {
    return 1
  }

  if (event1.date.endDate < event2.date.endDate) {
    return -1
  }

  if (event1.date.endDate > event2.date.endDate) {
    return 1
  }

  return event1.title.localeCompare(event2.title)
}

const mapJsonToEvent = (event: JsonEventType): EventModel => {
  const eventData = event.event
  const allDay = eventData.all_day
  const startTime = allDay ? '00:00:00' : eventData.start_time
  const endTime = allDay ? '23:59:59' : eventData.end_time
  return new EventModel({
    path: event.path,
    title: event.title,
    content: event.content,
    thumbnail: event.thumbnail,
    date: new DateModel({
      startDate: DateTime.fromJSDate(new Date(`${eventData.start_date} ${startTime}`)).setZone(eventData.timezone),
      endDate: DateTime.fromJSDate(new Date(`${eventData.end_date} ${endTime}`)).setZone(eventData.timezone),
      allDay,
    }),
    location:
      event.location.id !== null
        ? new LocationModel({
            id: event.location.id,
            name: event.location.name,
            address: event.location.address,
            town: event.location.town,
            postcode: event.location.postcode,
            country: event.location.country,
            latitude: event.location.latitude,
            longitude: event.location.longitude,
          })
        : null,
    excerpt: decodeHTML(event.excerpt),
    availableLanguages: mapAvailableLanguages(event.available_languages),
    lastUpdate: DateTime.fromJSDate(new Date(event.modified_gmt)).setZone('GMT'),
    featuredImage: event.featured_image
      ? new FeaturedImageModel({
          description: event.featured_image.description,
          thumbnail: event.featured_image.thumbnail[0]!,
          medium: event.featured_image.medium[0]!,
          large: event.featured_image.large[0]!,
          full: event.featured_image.full[0]!,
        })
      : null,
  })
}

const getEndDate = (event: JsonEventType, startDate: Date): Date => {
  const start = DateTime.fromJSDate(new Date(`${event.event.start_date} ${event.event.start_time}`)).setZone(
    event.event.timezone
  )
  const end = DateTime.fromJSDate(new Date(`${event.event.end_date} ${event.event.end_time}`)).setZone(
    event.event.timezone
  )
  const durationInDays = end.diff(start, 'days').days
  return DateTime.fromJSDate(startDate).startOf('day').plus({ days: durationInDays }).toJSDate()
}

const dateToString = (date: Date): string => date.toISOString().split('T')[0] ?? ''

const removeTrailingSlash = (path: string): string => path.replace(/\/$/, '')

// TODO IGAPP-1078: Remove creating of multiple events
const createRecurringEvents = (event: JsonEventType): JsonEventType[] => {
  if (!event.recurrence_rule) {
    return [event]
  }
  const rrule: RRule = rrulestr(event.recurrence_rule)
  const today = DateTime.now().toJSDate()
  const lastValidDay = DateTime.now().plus({ months: MAX_FUTURE_EVENT_IN_MONTHS }).toJSDate()

  const appendDate = (path: string, date: Date) => `${removeTrailingSlash(path)}$${dateToString(date)}`

  const appendDate = (path: string, date: Date) => `${removeTrailingSlash(path)}$${dateToString(date)}`

  const events: JsonEventType[] = rrule.between(today, lastValidDay).map(date => ({
    ...event,
    path: appendDate(event.path, date),
    available_languages: mapValues(event.available_languages, value => ({
      ...value,
      path: appendDate(value.path, date),
    })),
    event: {
      ...event.event,
      start_date: dateToString(date),
      end_date: dateToString(getEndDate(event, date)),
    },
  }))
  return events.slice(0, MAX_NUMBERS_OF_RECURRING_EVENTS)
}

export default (baseUrl: string): Endpoint<ParamsType, Array<EventModel>> =>
  new EndpointBuilder<ParamsType, Array<EventModel>>(EVENTS_ENDPOINT_NAME)
    .withParamsToUrlMapper(
      (params: ParamsType): string =>
        `${baseUrl}/${params.city}/${params.language}/wp-json/extensions/v3/events/?combine_recurring=True`
    )
    .withMapper(
      (json: Array<JsonEventType>): Array<EventModel> =>
        json.flatMap(createRecurringEvents).map(mapJsonToEvent).sort(eventCompare)
    )
    .build()
