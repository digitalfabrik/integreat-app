import { DateTime } from 'luxon'
import md5 from 'md5'
import { rrulestr } from 'rrule'
import seedrandom from 'seedrandom'

import DateModel from '../../models/DateModel'
import EventModel from '../../models/EventModel'
import LocationModel from '../../models/LocationModel'

type PageResourceCacheEntryStateType = {
  readonly filePath: string
  readonly lastUpdate: DateTime
  readonly hash: string
}
type PageResourceCacheStateType = Record<string, PageResourceCacheEntryStateType>
const MAX_PREDICTABLE_VALUE = 6
const LANGUAGES = ['de', 'en', 'ar']

class EventModelBuilder {
  _eventCount: number
  _seed: string
  _city: string
  _language: string
  _recurring: boolean

  constructor(seed: string, eventCount: number, city: string, language: string, recurring?: boolean) {
    this._seed = seed
    this._eventCount = eventCount
    this._city = city
    this._language = language
    this._recurring = recurring ?? false
  }

  _predictableNumber(index: number, max: number = MAX_PREDICTABLE_VALUE): number {
    return seedrandom(index + this._seed)() * max
  }

  build(): Array<EventModel> {
    return this.buildAll().map(all => all.event)
  }

  buildResources(): Record<string, PageResourceCacheStateType> {
    return this.buildAll().reduce<Record<string, PageResourceCacheStateType>>((result, { path, resources }) => {
      const newResult = result
      newResult[path] = resources
      return newResult
    }, {})
  }

  createResource(url: string, index: number, lastUpdate: DateTime): PageResourceCacheEntryStateType {
    const hash = md5(url)
    return {
      filePath: `path/to/documentDir/resource-cache/v1/${this._city}/files/${hash}.png`,
      lastUpdate: lastUpdate.plus({ days: this._predictableNumber(index) }),
      hash,
    }
  }

  /**
   * Builds the requested amount of events. Two builds with an identical seed will yield equal events.
   * Note that they are not identical. Furthermore instances of external classes like `moment` or `EventModel` maybe are
   * not equal when comparing all the properties.
   *
   * @returns The events and the corresponding resource cache
   */
  buildAll(): {
    path: string
    event: EventModel
    resources: PageResourceCacheStateType
  }[] {
    return Array.from(
      {
        length: this._eventCount,
      },
      (x, index) => {
        const mockDate = DateTime.fromISO('2015-01-01T00:00:00.000Z')
        const startDate = mockDate.plus({ years: this._predictableNumber(index) }).set({ millisecond: 0 })
        const endDate = mockDate.plus({ hours: this._predictableNumber(index) }).set({ millisecond: 0 })
        const lastUpdate = mockDate.minus({ months: this._predictableNumber(index) }).set({ millisecond: 0 })
        const path = `/${this._city}/${this._language}/events/event${index}`
        const resourceUrl1 = `https://cms.integreat-app.de/title_${index}-300x300.png`
        const resourceUrl2 = `https://cms.integreat-app.de/event_${index}-300x300.png`
        const thumbnail = `https://cms.integreat-app.de/thumbnails/event_${index}.png`
        const recurrence = this._recurring ? rrulestr('FREQ=WEEKLY;INTERVAL=3') : null
        return {
          path,
          event: new EventModel({
            path,
            title: 'first Event',
            availableLanguages: new Map(
              LANGUAGES.filter(language => language !== this._language).map(lng => [
                lng,
                `/${this._city}/${lng}/events/event${index}`,
              ]),
            ),
            date: new DateModel({
              startDate,
              endDate,
              allDay: false,
              recurrenceRule: recurrence,
            }),
            location: new LocationModel({
              id: 1,
              name: 'test',
              address: 'address',
              town: 'town',
              postcode: 'postcode',
              country: 'country',
              latitude: null,
              longitude: null,
            }),
            excerpt: 'excerpt',
            lastUpdate,
            content: `<h1>This is a sample event</h1>
                    <img src='${resourceUrl1}'/>
                    <p>This is a sample event</p>
                    <img src='${resourceUrl2}'/>`,
            thumbnail,
            featuredImage: null,
          }),
          resources: {
            [resourceUrl1]: this.createResource(resourceUrl1, index, lastUpdate),
            [resourceUrl2]: this.createResource(resourceUrl2, index, lastUpdate),
            [thumbnail]: this.createResource(thumbnail, index, lastUpdate),
          },
        }
      },
    )
  }
}

export default EventModelBuilder
