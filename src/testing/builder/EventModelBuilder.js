// @flow

import { DateModel, EventModel, LocationModel } from '@integreat-app/integreat-api-client'
import moment from 'moment-timezone'
import seedrandom from 'seedrandom'
import type { PageResourceCacheStateType } from '../../modules/app/StateType'
import hashUrl from '../../modules/endpoint/hashUrl'
import md5 from 'js-md5'
import type { FetchMapType } from '../../modules/endpoint/sagas/fetchResourceCache'
import { createFetchMap } from './util'
import { difference } from 'lodash'

const MAX_PREDICTABLE_VALUE = 6
const LANGUAGES = ['de', 'en', 'ar']

class EventModelBuilder {
  _eventCount: number
  _seed: string
  _city: string
  _language: string

  constructor (seed: string, eventCount: number, city: string, language: string) {
    this._seed = seed
    this._eventCount = eventCount
    this._city = city
    this._language = language
  }

  _predictableNumber (index: number, max: number = MAX_PREDICTABLE_VALUE): number {
    return seedrandom(index + this._seed)() * max
  }

  build (): Array<EventModel> {
    return this.buildAll().map(all => all.event)
  }

  buildResources (): { [path: string]: PageResourceCacheStateType } {
    return this.buildAll().reduce((result, { path, resources }) => {
      result[path] = resources
      return result
    }, {})
  }

  buildFetchMap (): FetchMapType {
    return createFetchMap(this.buildResources())
  }

  createResource (url: string, index: number, lastUpdate: moment): PageResourceCacheStateType {
    const hash = hashUrl(url)
    return {
      [url]: {
        filePath: `path/to/documentDir/resource-cache/v1/${this._city}/files/${hash}.png`,
        lastUpdate: moment(lastUpdate).add(this._predictableNumber(index), 'days'),
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
  buildAll (): Array<{ path: string, event: EventModel, resources: { [path: string]: PageResourceCacheStateType } }> {
    return Array.from({ length: this._eventCount }, (x, index) => {
      const mockDate = moment('2015-01-01T00:00:00.000Z', moment.ISO_8601)
      const startDate = moment(mockDate.add(this._predictableNumber(index), 'years').toISOString(), moment.ISO_8601)
      const endDate = moment(mockDate.add(this._predictableNumber(index), 'hours').toISOString(), moment.ISO_8601)
      const lastUpdate = moment(mockDate.subtract(this._predictableNumber(index), 'months').toISOString(), moment.ISO_8601)

      const path = `/${this._city}/${this._language}/events/event${index}`
      const resourceUrl1 = `https://integreat/title_${index}-300x300.png`
      const resourceUrl2 = `https://integreat/event_${index}-300x300.png`
      const thumbnail = `http://thumbnails/event_${index}.png`

      return {
        path,
        event: new EventModel({
          path,
          title: 'first Event',
          availableLanguages: new Map(difference(LANGUAGES, [this._language]).map(
            lng => [lng, `/${this._city}/${lng}/events/event${index}`]
          )),
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
                    <img src="${resourceUrl1}"/>
                    <p>This is a sample event</p>
                    <img src="${resourceUrl2}"/>`,
          thumbnail,
          hash: md5.create().update(Buffer.from([index])).hex()
        }),
        resources: {
          ...this.createResource(resourceUrl1, index, lastUpdate),
          ...this.createResource(resourceUrl2, index, lastUpdate),
          ...this.createResource(thumbnail, index, lastUpdate)
        }
      }
    })
  }
}

export default EventModelBuilder
