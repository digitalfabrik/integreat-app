import { DateTime, Interval } from 'luxon'

import { mapMarker, PoiFeature } from '../maps'
import ExtendedPageModel from './ExtendedPageModel'
import LocationModel from './LocationModel'
import OpeningHoursModel from './OpeningHoursModel'
import PageModel from './PageModel'
import PoiCategoryModel from './PoiCategoryModel'

class PoiModel extends ExtendedPageModel {
  _location: LocationModel<number>
  _excerpt: string
  _metaDescription: string | null
  _website: string | null
  _phoneNumber: string | null
  _email: string | null
  _openingHours: OpeningHoursModel[] | null
  _temporarilyClosed: boolean
  _category: PoiCategoryModel | null

  constructor(params: {
    path: string
    title: string
    content: string
    thumbnail: string
    availableLanguages: Map<string, string>
    metaDescription: string | null
    excerpt: string
    location: LocationModel<number>
    lastUpdate: DateTime
    email: string | null
    website: string | null
    phoneNumber: string | null
    temporarilyClosed: boolean
    openingHours: OpeningHoursModel[] | null
    category: PoiCategoryModel | null
  }) {
    const {
      category,
      openingHours,
      temporarilyClosed,
      location,
      excerpt,
      metaDescription,
      website,
      phoneNumber,
      email,
      ...other
    } = params
    super(other)
    this._location = location
    this._excerpt = excerpt
    this._metaDescription = metaDescription
    this._website = website
    this._phoneNumber = phoneNumber
    this._email = email
    this._openingHours = openingHours
    this._temporarilyClosed = temporarilyClosed
    this._category = category
  }

  get location(): LocationModel<number> {
    return this._location
  }

  get excerpt(): string {
    return this._excerpt
  }

  get metaDescription(): string | null {
    return this._metaDescription
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

  private getMarkerSymbol(): string {
    if (this.category) {
      if (this.category.color && this.category.icon) {
        const { color, icon } = this.category
        return `${icon}_${color}`
      }
    }
    return mapMarker.defaultSymbol
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
        category: this.category?.name,
        id,
        symbol: this.getMarkerSymbol(),
        thumbnail: this.thumbnail,
        path: this.path,
        slug: this.slug,
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

  get category(): PoiCategoryModel | null {
    return this._category
  }

  get isCurrentlyOpen(): boolean {
    if (!this.openingHours) {
      return false
    }
    // weekday returns 1-7 for the weekdays
    const currentWeekday = DateTime.now().weekday - 1
    const currentDay = this.openingHours[currentWeekday]

    if (currentDay) {
      if (currentDay.allDay) {
        return true
      }
      const dateFormat = DateTime.now().toLocaleString(DateTime.TIME_SIMPLE)
      const currentTime = DateTime.now().setLocale('de').toFormat(dateFormat)
      return currentDay.timeSlots.some(timeslot =>
        Interval.fromDateTimes(
          DateTime.fromFormat(timeslot.start, dateFormat),
          DateTime.fromFormat(timeslot.end, dateFormat)
        ).contains(DateTime.fromFormat(currentTime, dateFormat))
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
