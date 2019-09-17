// @flow

import { DateModel, EventModel, LocationModel } from '@integreat-app/integreat-api-client'
import moment from 'moment-timezone'
import seedrandom from 'seedrandom'
import type { FileCacheStateType } from '../../modules/app/StateType'
import hashUrl from '../../modules/endpoint/hashUrl'

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
    return this.buildAll().map(all => all.event)
  }

  buildResources (): { [path: string]: FileCacheStateType } {
    return this.buildAll().reduce((result, { path, resources }) => {
      result[path] = resources
      return result
    }, {})
  }

  createResource (url: string, index: number, lastUpdate: moment): FileCacheStateType {
    const hash = hashUrl(url)
    return {
      [url]: {
        filePath: `path/to/documentDir/resource-cache/v1/some-city/files/${hash}.png`,
        lastUpdate: moment(lastUpdate).add(this.predictableNumber(index), 'days'),
        hash
      }
    }
  }

  /**
   * Builds the requested amount of events. Two builds with an identical seed will yield equal events.
   * Note that they are not identical. Furthermore instances of external classes like `moment` or `EventModel` maybe are
   * not equal when comparing all the properties.
   *
   * @returns The events and the corresponding resource cache
   */
  buildAll (): Array<{ path: string, event: EventModel, resources: { [path: string]: FileCacheStateType } }> {
    return Array.from({ length: this._eventCount }, (x, index) => {
      const startDate = moment.tz('2015-01-01 00:00:00', 'UTC').add(this.predictableNumber(index), 'years')
      const endDate = moment(startDate).add(this.predictableNumber(index), 'hours')
      const lastUpdate = moment(startDate).subtract(this.predictableNumber(index), 'months')
      const path = `/augsburg/en/events/event${index}`
      return {
        path,
        event: new EventModel({
          id: index + 1,
          path,
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
          content: `<h1>This is a sample event</h1>
                    <img src="https://integreat/title_${index}-300x300.png"/>
                    <p>This is a sample event</p>
                    <img src="https://integreat/event_${index}-300x300.png"/>`,
          thumbnail: 'https://integreat/thumbnail.png'
        }),
        resources: {
          ...this.createResource(`https://integreat/title_${index}-300x300.png`, index),
          ...this.createResource(`https://integreat/event_${index}-300x300.png`, index)
        }
      }
    })
  }
}

export default EventModelBuilder
