import { decodeHTML } from 'entities'
import { DateTime } from 'luxon'
import { rrulestr } from 'rrule'

import Endpoint from '../Endpoint'
import EndpointBuilder from '../EndpointBuilder'
import { API_VERSION } from '../constants'
import mapAvailableLanguages from '../mapping/mapAvailableLanguages'
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

const eventCompare = (event1: EventModel, event2: EventModel): number => {
  if (event1.date.startDate < event2.date.startDate) {
    return -1
  }

  if (event1.date.startDate > event2.date.startDate) {
    return 1
  }

  if (!event1.date.endDate || !event2.date.endDate) {
    return event1.title.localeCompare(event2.title)
  }

  if (event1.date.endDate < event2.date.endDate) {
    return -1
  }

  if (event1.date.endDate > event2.date.endDate) {
    return 1
  }

  return event1.title.localeCompare(event2.title)
}

export default (baseUrl: string): Endpoint<ParamsType, EventModel[]> =>
  new EndpointBuilder<ParamsType, EventModel[]>(EVENTS_ENDPOINT_NAME)
    .withParamsToUrlMapper(
      (params: ParamsType): string =>
        `${baseUrl}/api/${API_VERSION}/${params.city}/${params.language}/events/?combine_recurring=True`,
    )
    .withMapper((json: JsonEventType[]): EventModel[] =>
      json
        .map((event: JsonEventType): EventModel => {
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
              recurrenceRule: event.recurrence_rule ? rrulestr(event.recurrence_rule) : null,
              onlyWeekdays: eventData.only_weekdays,
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
            featuredImage: event.featured_image
              ? new FeaturedImageModel({
                  description: event.featured_image.description,
                  thumbnail: event.featured_image.thumbnail[0],
                  medium: event.featured_image.medium[0],
                  large: event.featured_image.large[0],
                  full: event.featured_image.full[0],
                })
              : null,
            poiPath: event.location_path,
          })
        })
        .sort(eventCompare),
    )
    .build()
