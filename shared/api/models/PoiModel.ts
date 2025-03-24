import distance from '@turf/distance'
import { DateTime, Interval } from 'luxon'

import { GeoJsonPoi, LocationType } from '../../constants/maps'
import ContactModel from './ContactModel'
import ExtendedPageModel from './ExtendedPageModel'
import LocationModel from './LocationModel'
import OpeningHoursModel from './OpeningHoursModel'
import PageModel from './PageModel'
import PoiCategoryModel from './PoiCategoryModel'

class PoiModel extends ExtendedPageModel {
  _location: LocationModel<number>
  _excerpt: string
  _metaDescription: string | null
  _openingHours: OpeningHoursModel[] | null
  _temporarilyClosed: boolean
  _category: PoiCategoryModel
  _appointmentUrl: string | null
  _contacts: ContactModel[]

  constructor(params: {
    path: string
    title: string
    content: string
    thumbnail: string | null
    availableLanguages: Record<string, string>
    metaDescription: string | null
    excerpt: string
    location: LocationModel<number>
    lastUpdate: DateTime
    temporarilyClosed: boolean
    openingHours: OpeningHoursModel[] | null
    category: PoiCategoryModel
    appointmentUrl: string | null
    contacts: ContactModel[]
  }) {
    const {
      category,
      openingHours,
      temporarilyClosed,
      location,
      excerpt,
      metaDescription,
      appointmentUrl,
      contacts,
      ...other
    } = params
    super(other)
    this._location = location
    this._excerpt = excerpt
    this._metaDescription = metaDescription
    this._openingHours = openingHours
    this._temporarilyClosed = temporarilyClosed
    this._category = category
    this._appointmentUrl = appointmentUrl
    this._contacts = contacts
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

  private getMarkerSymbol(): string {
    const { color, iconName } = this.category
    return `${iconName}_${color}`
  }

  getFeature(): GeoJsonPoi {
    return {
      id: this.location.id,
      title: this.title,
      symbol: this.getMarkerSymbol(),
      slug: this.slug,
    }
  }

  distance(location: LocationType): number {
    return distance(location, this.location.coordinates)
  }

  get openingHours(): OpeningHoursModel[] | null {
    return this._openingHours
  }

  get temporarilyClosed(): boolean {
    return this._temporarilyClosed
  }

  get appointmentUrl(): string | null {
    return this._appointmentUrl
  }

  get category(): PoiCategoryModel {
    return this._category
  }

  get isCurrentlyOpen(): boolean {
    if (!this.openingHours) {
      return false
    }
    // isoWeekday return 1-7 for the weekdays
    const currentWeekday = DateTime.now().weekday - 1
    const currentDay = this.openingHours[currentWeekday]

    if (currentDay) {
      if (currentDay.allDay) {
        return true
      }
      const dateFormat = 't'
      const currentTime = DateTime.now().toFormat(dateFormat, { locale: 'de' })
      return currentDay.timeSlots.some(timeslot =>
        Interval.fromDateTimes(
          DateTime.fromFormat(timeslot.start, dateFormat, { locale: 'de' }),
          DateTime.fromFormat(timeslot.end, dateFormat, { locale: 'de' }),
        ).contains(DateTime.fromFormat(currentTime, dateFormat, { locale: 'de' })),
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

  get contacts(): ContactModel[] {
    return this._contacts
  }
}

export default PoiModel
