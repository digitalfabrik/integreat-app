import moment, { Moment } from 'moment'

import { mapMarker, PoiFeature } from '../maps'
import ExtendedPageModel from './ExtendedPageModel'
import LocationModel from './LocationModel'
import OpeningHoursModel from './OpeningHoursModel'
import PageModel from './PageModel'

class PoiModel extends ExtendedPageModel {
  _location: LocationModel<number>
  _excerpt: string
  _website: string | null
  _phoneNumber: string | null
  _email: string | null
  _openingHours: OpeningHoursModel[] | null
  _temporarilyClosed: boolean

  constructor(params: {
    path: string
    title: string
    content: string
    thumbnail: string
    availableLanguages: Map<string, string>
    excerpt: string
    location: LocationModel<number>
    lastUpdate: Moment
    email: string | null
    website: string | null
    phoneNumber: string | null
    temporarilyClosed: boolean
    openingHours: OpeningHoursModel[] | null
  }) {
    const { openingHours, temporarilyClosed, location, excerpt, website, phoneNumber, email, ...other } = params
    super(other)
    this._location = location
    this._excerpt = excerpt
    this._website = website
    this._phoneNumber = phoneNumber
    this._email = email
    this._openingHours = openingHours
    this._temporarilyClosed = temporarilyClosed
  }

  get location(): LocationModel<number> {
    return this._location
  }

  get excerpt(): string {
    return this._excerpt
  }

  get urlSlug(): string {
    return this._path.split('/').pop() ?? ''
  }

  get website(): string | null {
    return this._website
  }

  get phoneNumber(): string | null {
    return this._phoneNumber
  }

  get email(): string | null {
    return this._email
  }

  get featureLocation(): PoiFeature {
    const { coordinates, name, id, address } = this.location

    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates,
      },
      properties: {
        title: name,
        id,
        // TODO gonna be replaced by proper mapping category->symbolName IGAPP-736
        symbol: mapMarker.symbol,
        thumbnail: this.thumbnail,
        path: this.path,
        urlSlug: this.urlSlug,
        address,
        closeToOtherPoi: false,
      },
    }
  }

  get openingHours(): OpeningHoursModel[] | null {
    return this._openingHours
  }

  get temporarilyClosed(): boolean {
    return this._temporarilyClosed
  }

  get isCurrentlyOpen(): boolean {
    if (!this.openingHours) {
      return false
    }
    // isoWeekday return 1-7 for the weekdays
    const weekday = moment().isoWeekday() - 1
    const currentDay = this.openingHours[weekday]

    if (currentDay) {
      if (currentDay.allDay) {
        return true
      }
      const dateFormat = 'LT'
      const currentTime = moment().locale('de').format(dateFormat)
      return currentDay.timeSlots.some(timeslot =>
        moment(currentTime, dateFormat).isBetween(moment(timeslot.start, dateFormat), moment(timeslot.end, dateFormat))
      )
    }
    return false
  }

  isEqual(other: PageModel): boolean {
    return (
      other instanceof PoiModel &&
      super.isEqual(other) &&
      this.location.isEqual(other.location) &&
      this.excerpt === other.excerpt
    )
  }
}

export default PoiModel
