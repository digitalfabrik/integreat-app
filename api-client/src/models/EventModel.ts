import { decodeHTML } from 'entities'
import moment, { Moment } from 'moment'

import { getExcerpt } from '../index'
import { formatDateICal } from '../utils'
import generateUID from '../utils/generateUID'
import DateModel from './DateModel'
import ExtendedPageModel from './ExtendedPageModel'
import FeaturedImageModel from './FeaturedImageModel'
import LocationModel from './LocationModel'

class EventModel extends ExtendedPageModel {
  _date: DateModel
  _location: LocationModel<number | null> | null
  _excerpt: string
  _featuredImage: FeaturedImageModel | null | undefined

  constructor(params: {
    path: string
    title: string
    content: string
    thumbnail: string
    date: DateModel
    location: LocationModel<number | null> | null
    excerpt: string
    availableLanguages: Map<string, string>
    lastUpdate: Moment
    featuredImage: FeaturedImageModel | null | undefined
  }) {
    const { date, location, excerpt, featuredImage, ...other } = params
    super(other)
    this._date = date
    this._location = location
    this._excerpt = decodeHTML(excerpt)
    this._featuredImage = featuredImage
  }

  get date(): DateModel {
    return this._date
  }

  get location(): LocationModel<number | null> | null {
    return this._location
  }

  get excerpt(): string {
    return this._excerpt
  }

  get featuredImage(): FeaturedImageModel | null | undefined {
    return this._featuredImage
  }

  toICal(baseUrl: string, appName: string): string {
    const { title, location, path, date, excerpt } = this
    const body: string[] = []
    body.push(`DTSTAMP:${formatDateICal(moment())}`)
    body.push(`UID:${generateUID()}`)
    body.push(`SUMMARY:${title}`)
    body.push(`DTSTART:${formatDateICal(date.startDate)}`)
    body.push(`DEND:${formatDateICal(date.endDate)}`)
    if (location) {
      body.push(`LOCATION:${location.fullAddress}`)
    }

    if (path) {
      body.push(
        `DESCRIPTION:${getExcerpt(excerpt, {
          query: undefined,
          maxChars: 150,
          replaceLineBreaks: false,
        })}\\n\\n${baseUrl}${path}`
      )
    }

    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      `PRODID:${appName}`,
      'BEGIN:VEVENT',
      body.join('\n'),
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\n')
  }

  isEqual(other: EventModel): boolean {
    const isLocationEqual =
      this.location === null
        ? other.location === null
        : other.location !== null && this.location.isEqual(other.location)
    return (
      super.isEqual(other) &&
      this.date.isEqual(other.date) &&
      isLocationEqual &&
      this.excerpt === other.excerpt &&
      (this.featuredImage
        ? this.featuredImage.isEqual(other.featuredImage)
        : this.featuredImage === other.featuredImage)
    )
  }
}

export default EventModel
