import moment, { Moment } from 'moment'
import seedrandom from 'seedrandom'
import md5 from 'js-md5'
import EventModel from '../models/EventModel'
import DateModel from '../models/DateModel'
import LocationModel from '../models/LocationModel'
import hashUrl from '../hashUrl'
type PageResourceCacheEntryStateType = {
  readonly filePath: string
  readonly lastUpdate: Moment
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

  constructor(seed: string, eventCount: number, city: string, language: string) {
    this._seed = seed
    this._eventCount = eventCount
    this._city = city
    this._language = language
  }

  _predictableNumber(index: number, max: number = MAX_PREDICTABLE_VALUE): number {
    return seedrandom(index + this._seed)() * max
  }

  build(): Array<EventModel> {
    return this.buildAll().map(all => all.event)
  }

  buildResources(): Record<string, PageResourceCacheStateType> {
    return this.buildAll().reduce((result, { path, resources }) => {
      result[path] = resources
      return result
    }, {})
  }

  createResource(url: string, index: number, lastUpdate: Moment): PageResourceCacheEntryStateType {
    const hash = hashUrl(url)
    return {
      filePath: `path/to/documentDir/resource-cache/v1/${this._city}/files/${hash}.png`,
      lastUpdate: moment(lastUpdate).add(this._predictableNumber(index), 'days'),
      hash
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
        length: this._eventCount
      },
      (x, index) => {
        const mockDate = moment('2015-01-01T00:00:00.000Z', moment.ISO_8601)
        const startDate = moment(mockDate.add(this._predictableNumber(index), 'years').toISOString(), moment.ISO_8601)
        const endDate = moment(mockDate.add(this._predictableNumber(index), 'hours').toISOString(), moment.ISO_8601)
        const lastUpdate = moment(
          mockDate.subtract(this._predictableNumber(index), 'months').toISOString(),
          moment.ISO_8601
        )
        const path = `/${this._city}/${this._language}/events/event${index}`
        const resourceUrl1 = `https://cms.integreat-app.de/title_${index}-300x300.png`
        const resourceUrl2 = `https://cms.integreat-app.de/event_${index}-300x300.png`
        const thumbnail = `http://cms.integreat-app.de/thumbnails/event_${index}.png`
        return {
          path,
          event: new EventModel({
            path,
            title: 'first Event',
            availableLanguages: new Map(
              LANGUAGES.filter(language => language !== this._language).map(lng => [
                lng,
                `/${this._city}/${lng}/events/event${index}`
              ])
            ),
            date: new DateModel({
              startDate,
              endDate,
              allDay: false
            }),
            location: new LocationModel({
              name: null,
              address: 'address',
              town: 'town',
              state: null,
              postcode: 'postcode',
              region: null,
              country: null,
              latitude: null,
              longitude: null
            }),
            excerpt: 'excerpt',
            lastUpdate,
            content: `<h1>This is a sample event</h1>
                    <img src="${resourceUrl1}"/>
                    <p>This is a sample event</p>
                    <img src="${resourceUrl2}"/>`,
            thumbnail,
            featuredImage: null,
            hash: md5
              .create()
              .update(Buffer.from([index]))
              .hex()
          }),
          resources: {
            [resourceUrl1]: this.createResource(resourceUrl1, index, lastUpdate),
            [resourceUrl2]: this.createResource(resourceUrl2, index, lastUpdate),
            [thumbnail]: this.createResource(thumbnail, index, lastUpdate)
          }
        }
      }
    )
  }
}

export default EventModelBuilder
