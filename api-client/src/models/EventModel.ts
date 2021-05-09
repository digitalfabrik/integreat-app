import type Moment from 'moment'
import LocationModel from './LocationModel'
import DateModel from './DateModel'
import ExtendedPageModel from './ExtendedPageModel'
import FeaturedImageModel from './FeaturedImageModel'
import PageModel from './PageModel'

class EventModel extends ExtendedPageModel {
  _date: DateModel
  _location: LocationModel
  _excerpt: string
  _featuredImage: FeaturedImageModel | null | undefined

  constructor(params: {
    path: string
    title: string
    content: string
    thumbnail: string
    date: DateModel
    location: LocationModel
    excerpt: string
    availableLanguages: Map<string, string>
    lastUpdate: Moment
    hash: string
    featuredImage: FeaturedImageModel | null | undefined
  }) {
    const { date, location, excerpt, featuredImage, ...other } = params
    super(other)
    this._date = date
    this._location = location
    this._excerpt = excerpt
    this._featuredImage = featuredImage
  }

  get date(): DateModel {
    return this._date
  }

  get location(): LocationModel {
    return this._location
  }

  get excerpt(): string {
    return this._excerpt
  }

  get featuredImage(): FeaturedImageModel | null | undefined {
    return this._featuredImage
  }

  isEqual(other: PageModel): boolean {
    return (
      other instanceof EventModel &&
      super.isEqual(other) &&
      this.date.isEqual(other.date) &&
      this.location.isEqual(other.location) &&
      this.excerpt === other.excerpt &&
      (this.featuredImage
        ? this.featuredImage.isEqual(other.featuredImage)
        : this.featuredImage === other.featuredImage)
    )
  }
}

export default EventModel