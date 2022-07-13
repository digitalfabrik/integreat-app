import { decodeHTML } from 'entities'
import { Moment } from 'moment'

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
