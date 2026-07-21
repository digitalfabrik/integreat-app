import { decodeHTML } from 'entities'
import { DateTime } from 'luxon'
import { v5 } from 'uuid'

import { formatDateICal } from '../../utils/date.ts'
import DateModel from './DateModel.ts'
import ExtendedDocumentModel from './ExtendedDocumentModel.ts'
import FeaturedImageModel from './FeaturedImageModel.ts'
import LocationModel from './LocationModel.ts'

class EventModel extends ExtendedDocumentModel {
  _date: DateModel
  _location: LocationModel<number | null> | null
  _meetingUrl: string | null
  _excerpt: string
  _featuredImage: FeaturedImageModel | null
  _placePath: string | null

  constructor(params: {
    path: string
    title: string
    content: string
    thumbnail: string | null
    date: DateModel
    location: LocationModel<number | null> | null
    meetingUrl: string | null
    excerpt: string
    availableLanguages: Record<string, string>
    lastUpdate: DateTime
    featuredImage: FeaturedImageModel | null
    placePath: string | null
  }) {
    const { date, location, meetingUrl, excerpt, featuredImage, placePath, ...other } = params
    super(other)
    this._date = date
    this._location = location
    this._meetingUrl = meetingUrl
    // Remove carriage returns that break e.g. ical
    this._excerpt = decodeHTML(excerpt).replace(/\r/g, '').trim()
    this._featuredImage = featuredImage
    this._placePath = placePath
  }

  get date(): DateModel {
    return this._date.recurrences(1)[0] ?? this._date
  }

  get location(): LocationModel<number | null> | null {
    return this._location
  }

  get meetingUrl(): string | null {
    return this._meetingUrl
  }

  get excerpt(): string {
    return this._excerpt
  }

  get featuredImage(): FeaturedImageModel | null {
    return this._featuredImage
  }

  get placePath(): string | null {
    return this._placePath
  }

  get isRecurring(): boolean {
    return this.date.hasMoreRecurrencesThan(1)
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
