import { decodeHTML } from 'entities'
import { DateTime } from 'luxon'
import { v5 } from 'uuid'

import { formatDateICal } from '../../utils'
import DateModel from './DateModel'
import ExtendedPageModel from './ExtendedPageModel'
import FeaturedImageModel from './FeaturedImageModel'
import LocationModel from './LocationModel'

class EventModel extends ExtendedPageModel {
  _date: DateModel
  _location: LocationModel<number | null> | null
  _excerpt: string
  _featuredImage: FeaturedImageModel | null
  _poiPath: string | null

  constructor(params: {
    path: string
    title: string
    content: string
    thumbnail: string | null
    date: DateModel
    location: LocationModel<number | null> | null
    excerpt: string
    availableLanguages: Record<string, string>
    lastUpdate: DateTime
    featuredImage: FeaturedImageModel | null
    poiPath: string | null
  }) {
    const { date, location, excerpt, featuredImage, poiPath, ...other } = params
    super(other)
    this._date = date
    this._location = location
    // Remove carriage returns that break e.g. ical
    this._excerpt = decodeHTML(excerpt).replace(/\r/g, '').trim()
    this._featuredImage = featuredImage
    this._poiPath = poiPath
  }

  get date(): DateModel {
    return this._date.recurrences(1)[0] ?? this._date
  }

  get location(): LocationModel<number | null> | null {
    return this._location
  }

  get excerpt(): string {
    return this._excerpt
  }

  get featuredImage(): FeaturedImageModel | null {
    return this._featuredImage
  }

  get poiPath(): string | null {
    return this._poiPath
  }

  toICal(baseUrl: string, appName: string, recurring: boolean): string {
    const { title, location, path, date, excerpt, lastUpdate } = this
    const url = `${baseUrl}${path}`
    const uid = v5(`${url}/${formatDateICal(lastUpdate)}`, v5.URL)
    const timezone = date.startDate.zone.name

    const body: string[] = []
    body.push(`DTSTAMP:${formatDateICal(DateTime.now())}`)
    body.push(`UID:${uid}`)
    body.push(`SUMMARY:${title}`)
    body.push(`DTSTART;TZID=${timezone}:${formatDateICal(date.startDate)}`)
    if (date.endDate) {
      body.push(`DTEND;TZID=${timezone}:${formatDateICal(date.endDate)}`)
    }
    // For iCal newlines have to be escaped as each line is treated as separate property, see #2690
    body.push(`DESCRIPTION:${excerpt}\n\n${url}`.replace(/\n/g, '\\n'))

    if (location) {
      body.push(`LOCATION:${location.fullAddress}`)
    }

    if (recurring && date.recurrenceRule) {
      const recurrence = date.recurrenceRule.toString()
      if (recurrence) {
        body.push(recurrence)
      }
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
