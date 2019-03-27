// @flow

import EndpointBuilder from '../EndpointBuilder'
import type { JsonEventType } from '../types'
import EventModel from '../models/EventModel'
import normalizePath from '../normalizePath'
import { decodeHTML } from 'entities'
import mapAvailableLanguages from '../mapAvailableLanguages'
import moment from 'moment-timezone'
import DateModel from '../models/DateModel'
import LocationModel from '../models/LocationModel'
import Endpoint from '../Endpoint'
import sanitizeHtml from 'sanitize-html-react'

export const EVENTS_ENDPOINT_NAME = 'events'

type ParamsType = { city: string, language: string }

export default (baseUrl: string): Endpoint<ParamsType, Array<EventModel>> => new EndpointBuilder(EVENTS_ENDPOINT_NAME)
  .withParamsToUrlMapper((params: ParamsType): string =>
    `${baseUrl}/${params.city}/${params.language}/wp-json/extensions/v3/events`
  )
  .withMapper((json: Array<JsonEventType>): Array<EventModel> => json
    .map((event: JsonEventType) => {
      const eventData = event.event
      const allDay = eventData.all_day
      const startTime = allDay ? '00:00:00' : eventData.start_time
      const endTime = allDay ? '23:59:59' : eventData.end_time
      return new EventModel({
        path: normalizePath(event.path),
        title: event.title,
        content: sanitizeHtml(event.content, {
          allowedSchemes: ['http', 'https', 'data', 'tel', 'mailto'],
          allowedTags: false,
          allowedAttributes: false
        }),
        thumbnail: event.thumbnail,
        date: new DateModel({
          startDate: moment.tz(`${eventData.start_date} ${startTime}`, eventData.timezone),
          endDate: moment.tz(`${eventData.end_date} ${endTime}`, eventData.timezone),
          allDay: allDay
        }),
        location: new LocationModel({
          address: event.location.address,
          town: event.location.town,
          postcode: event.location.postcode,
          latitude: event.location.latitude,
          longitude: event.location.longitude
        }),
        excerpt: decodeHTML(event.excerpt),
        availableLanguages: mapAvailableLanguages(event.available_languages),
        lastUpdate: moment.tz(event.modified_gmt, 'GMT'),
        hash: event.hash
      })
    })
    .sort((event1, event2) => {
      if (event1.date.startDate.isBefore(event2.date.startDate)) { return -1 }
      if (event1.date.startDate.isAfter(event2.date.startDate)) { return 1 }
      return 0
    })
  )
  .build()
