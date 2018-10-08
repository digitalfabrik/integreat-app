// @flow

import { apiUrl } from '../constants'
import EndpointBuilder from '../EndpointBuilder'
import type { JsonPageType } from '../types'
import mapPages from './mapPages'
import EventModel from '../models/EventModel'

const EVENTS_ENDPOINT_NAME = 'events'

type ParamsType = {city: string, language: string}

export default new EndpointBuilder(EVENTS_ENDPOINT_NAME)
  .withParamsToUrlMapper((params: ParamsType): string =>
    `${apiUrl}/${params.city}/${params.language}/wp-json/extensions/v3/events`
  )
  .withMapper((json: Array<JsonPageType>): Array<EventModel> => mapPages(json)
    .map(page => {
      const {order, parentPath, date, location, ...pageProps} = page
      if (!date) {
        throw new Error('A date is required to create an EventModel')
      } else if (!location) {
        throw new Error('A location is required to create an EventModel')
      }
      return new EventModel({date, location, ...pageProps})
    })
    .sort((event1, event2) => {
      if (event1.date.startDate.isBefore(event2.date.startDate)) { return -1 }
      if (event1.date.startDate.isAfter(event2.date.startDate)) { return 1 }
      return 0
    })
  )
  .build()
