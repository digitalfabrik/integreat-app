// @flow

import type Moment from 'moment'
import LocationModel from './LocationModel'
import DateModel from './DateModel'
import ExtendedPageModel from './ExtendedPageModel'
import FeaturedImageModel from './FeaturedImageModel'

class EventModel extends ExtendedPageModel {
  _date: DateModel
  _location: LocationModel
  _excerpt: string
  _featuredImage: ?FeaturedImageModel

  constructor (params: {|
    path: string, title: string, content: string, thumbnail: string,
    date: DateModel, location: LocationModel, excerpt: string, availableLanguages: Map<string, string>,
    lastUpdate: Moment, hash: string, featuredImage: ?FeaturedImageModel
  |}) {
    const { date, location, excerpt, featuredImage, ...other } = params
    super(other)
    this._date = date
    this._location = location
    this._excerpt = excerpt
    this._featuredImage = featuredImage
  }

  get date (): DateModel {
    return this._date
  }

  get location (): LocationModel {
    return this._location
  }

  get excerpt (): string {
    return this._excerpt
  }

  get featuredImage (): ?FeaturedImageModel {
    return this._featuredImage
  }

  isEqual (other: EventModel): boolean {
    return super.isEqual(other) &&
      this.date.isEqual(other.date) &&
      this.location.isEqual(other.location) &&
      this.excerpt === other.excerpt &&
      ((!this.featuredImage && this.featuredImage === other.featuredImage) || this.featuredImage.isEqual(other.featuredImage))
  }
}

export default EventModel
