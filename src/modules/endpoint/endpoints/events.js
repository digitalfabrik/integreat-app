// @flow

import moment from 'moment'
import { apiUrl } from '../constants'
import EventModel from '../models/EventModel'
import EndpointBuilder from '../EndpointBuilder'
import ParamMissingError from '../errors/ParamMissingError'
import type { JsonEventType } from '../types'
import { compose } from 'lodash/fp'
import normalizePath from 'normalize-path'

const EVENTS_ENDPOINT_NAME = 'events'

type ParamsType = {
  city: ?string,
  language: ?string
}

export default new EndpointBuilder(EVENTS_ENDPOINT_NAME)
  .withParamsToUrlMapper((params: ParamsType): string => {
    if (!params.city) {
      throw new ParamMissingError(EVENTS_ENDPOINT_NAME, 'city')
    }
    if (!params.language) {
      throw new ParamMissingError(EVENTS_ENDPOINT_NAME, 'language')
    }
    return `${apiUrl}/${params.city}/${params.language}/wp-json/extensions/v3/events`
  })
  .withMapper((json: Array<JsonEventType>) => json
    .map((event: JsonEventType) => {
      const allDay = event.event.all_day !== '0'
      const normalize = compose([decodeURIComponent, normalizePath])
      const availableLanguages = new Map()
      Object.keys(event.available_languages)
        .forEach(language => availableLanguages.set(language, normalize(event.available_languages[language].path)))
      return new EventModel({
        id: event.id,
        path: normalize(event.path),
        title: event.title,
        content: event.content,
        thumbnail: event.thumbnail,
        address: event.location.address,
        town: event.location.town,
        startDate: moment(`${event.event.start_date} ${allDay ? '00:00:00' : event.event.start_time}`),
        endDate: moment(`${event.event.end_date} ${allDay ? '23:59:59' : event.event.end_time}`),
        allDay: allDay,
        excerpt: event.excerpt,
        availableLanguages: availableLanguages
      })
    })
    .filter(event => event.startDate.isValid())
    .filter(event => event.startDate.isAfter(moment()) || (event.endDate.isValid() && event.endDate.isAfter(moment())))
    .sort((event1, event2) => {
      if (event1.startDate.isBefore(event2.startDate)) { return -1 }
      if (event1.startDate.isAfter(event2.startDate)) { return 1 }
      return 0
    })
  )
  .build()
