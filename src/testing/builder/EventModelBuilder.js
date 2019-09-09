// @flow

import { DateModel, EventModel, LocationModel } from '@integreat-app/integreat-api-client'
import moment from 'moment-timezone'
import seedrandom from 'seedrandom'

const MAX_PREDICTABLE_VALUE = 6

class EventModelBuilder {
  _eventCount: number
  _seed: string

  constructor (seed: string, eventCount: number) {
    this._seed = seed
    this._eventCount = eventCount
  }

  predictableNumber (index: number, max: number = MAX_PREDICTABLE_VALUE): number {
    return seedrandom(index + this._seed)() * max
  }

  build (): Array<EventModel> {
    return Array.from({ length: this._eventCount }, (x, index) => {
      const startDate = moment.tz('2015-01-01 00:00:00', 'UTC').add(this.predictableNumber(index), 'years')
      const endDate = moment(startDate).add(this.predictableNumber(index), 'hours')
      const lastUpdate = moment(startDate).subtract(this.predictableNumber(index), 'months')

      return new EventModel({
        id: index + 1,
        path: `/augsburg/en/events/event${index}`,
        title: 'first Event',
        availableLanguages: new Map(
          [['de', `/augsburg/de/events/event${index}`], ['ar', `/augsburg/ar/events/event${index}`]]),
        date: new DateModel({
          startDate,
          endDate,
          allDay: false
        }),
        location: new LocationModel({
          address: 'address',
          town: 'town',
          postcode: 'postcode'
        }),
        excerpt: 'excerpt',
        lastUpdate,
        content: 'content',
        thumbnail: 'thumbnail'
      })
    })
  }
}

export default EventModelBuilder
