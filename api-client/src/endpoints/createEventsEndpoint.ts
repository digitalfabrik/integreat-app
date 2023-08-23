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
  return new EventModel({
    path: event.path,
    title: event.title,
    content: event.content,
    thumbnail: event.thumbnail,
    date: new DateModel({
      startDate: DateTime.fromISO(eventData.start),
      endDate: DateTime.fromISO(eventData.end),
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
    lastUpdate: DateTime.fromISO(event.last_updated),
    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    featuredImage: event.featured_image
      ? new FeaturedImageModel({
          description: event.featured_image.description,
          thumbnail: event.featured_image.thumbnail[0]!,
          medium: event.featured_image.medium[0]!,
          large: event.featured_image.large[0]!,
          full: event.featured_image.full[0]!,
        })
      : null,
    /* eslint-enable @typescript-eslint/no-non-null-assertion */
  })
}

const getEndDate = (event: JsonEventType, startDate: Date): Date => {
  const start = DateTime.fromISO(event.event.start)
  const end = DateTime.fromISO(event.event.end)
  const durationInDays = Math.floor(end.diff(start, 'days').days)
  return DateTime.fromJSDate(new Date(startDate))
    .startOf('day')
    .plus({ days: durationInDays })
    .set({
      hour: end.toJSDate().getHours(),
      minute: end.toJSDate().getMinutes(),
    })
    .toJSDate()
}

// TODO IGAPP-281: The workaround of the next two functions can probably be removed
const leftPad = (number: number): string => {
  const numberAsString = number.toString()
  if (numberAsString.length === 1) {
    return `0${number}`
  }
  return numberAsString
}

export const dateToString = (date: Date): string =>
  `${date.getFullYear()}-${leftPad(date.getMonth() + 1)}-${leftPad(date.getDate())}`

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

  const events: JsonEventType[] = rrule.between(today, lastValidDay).map(date => ({
    ...event,
    path: appendDate(event.path, date),
    available_languages: mapValues(event.available_languages, value => ({
      ...value,
      path: appendDate(value.path, date),
    })),
    event: {
      ...event.event,
      start: date.toISOString(),
      start_date: dateToString(date),
      end: getEndDate(event, date).toISOString(),
      end_date: dateToString(getEndDate(event, date)),
    },
  }))
  return events.slice(0, MAX_NUMBERS_OF_RECURRING_EVENTS)
}

export default (baseUrl: string): Endpoint<ParamsType, Array<EventModel>> =>
  new EndpointBuilder<ParamsType, Array<EventModel>>(EVENTS_ENDPOINT_NAME)
    .withParamsToUrlMapper(
      (params: ParamsType): string =>
        `${baseUrl}/${params.city}/${params.language}/wp-json/extensions/v3/events/?combine_recurring=True`,
    )
    .withMapper(
      (json: Array<JsonEventType>): Array<EventModel> =>
        json.flatMap(createRecurringEvents).map(mapJsonToEvent).sort(eventCompare),
    )
    .build()
