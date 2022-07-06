import { decodeHTML } from 'entities'
import moment from 'moment-timezone'

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
export default (baseUrl: string): Endpoint<ParamsType, Array<EventModel>> =>
  new EndpointBuilder<ParamsType, Array<EventModel>>(EVENTS_ENDPOINT_NAME)
    .withParamsToUrlMapper(
      (params: ParamsType): string => `${baseUrl}/${params.city}/${params.language}/wp-json/extensions/v3/events`
    )
    .withMapper(
      (json: Array<JsonEventType>): Array<EventModel> =>
        json
          .map((event: JsonEventType) => {
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
                startDate: moment.tz(`${eventData.start_date} ${startTime}`, eventData.timezone),
                endDate: moment.tz(`${eventData.end_date} ${endTime}`, eventData.timezone),
                allDay
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
                      longitude: event.location.longitude
                    })
                  : null,
              excerpt: decodeHTML(event.excerpt),
              availableLanguages: mapAvailableLanguages(event.available_languages),
              lastUpdate: moment.tz(event.modified_gmt, 'GMT'),
              hash: event.hash,
              featuredImage: event.featured_image
                ? new FeaturedImageModel({
                    description: event.featured_image.description,
                    thumbnail: event.featured_image.thumbnail[0]!,
                    medium: event.featured_image.medium[0]!,
                    large: event.featured_image.large[0]!,
                    full: event.featured_image.full[0]!
                  })
                : null
            })
          })
          .sort((event1, event2) => {
            if (event1.date.startDate.isBefore(event2.date.startDate)) {
              return -1
            }

            if (event1.date.startDate.isAfter(event2.date.startDate)) {
              return 1
            }

            return 0
          })
    )
    .build()
