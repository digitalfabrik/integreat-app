// @flow

import EndpointBuilder from '../EndpointBuilder'
import type { JsonEventType } from '../types'
import EventModel from '../models/EventModel'
import normalizePath from '../normalizePath'
import { decodeHTML } from 'entities'
import mapAvailableLanguages from '../mapAvailableLanguages'
import moment from 'moment'
import DateModel from '../models/DateModel'
import LocationModel from '../models/LocationModel'
import Endpoint from '../Endpoint'
import sanitizeHtml from 'sanitize-html-react'

const EVENTS_ENDPOINT_NAME = 'events'

type ParamsType = { city: string, language: string }

const endpoint: Endpoint<ParamsType, Array<EventModel>> = new EndpointBuilder(EVENTS_ENDPOINT_NAME)
  .withParamsToUrlMapper((apiUrl: string, params: ParamsType): string =>
    `${apiUrl}/${params.city}/${params.language}/wp-json/extensions/v3/events`
  )
  .withMapper((json: Array<JsonEventType>): Array<EventModel> => json
    .map((event: JsonEventType) => {
      const allDay = event.event.all_day
      return new EventModel({
        id: event.id,
        path: normalizePath(event.path),
        title: event.title,
        content: sanitizeHtml(event.content, {
          allowedSchemes: ['http', 'https', 'data', 'tel', 'mailto'],
          allowedTags: false,
          allowedAttributes: false
        }),
        thumbnail: event.thumbnail,
        date: new DateModel({
          startDate: moment(`${event.event.start_date} ${allDay ? '00:00:00' : event.event.start_time}`),
          endDate: moment(`${event.event.end_date} ${allDay ? '23:59:59' : event.event.end_time}`),
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
        lastUpdate: moment(event.modified_gmt)
      })
    })
    .sort((event1, event2) => {
      if (event1.date.startDate.isBefore(event2.date.startDate)) { return -1 }
      if (event1.date.startDate.isAfter(event2.date.startDate)) { return 1 }
      return 0
    })
  )
  .build()

export default endpoint
