// @flow

import type Moment from 'moment'
import LocationModel from './LocationModel'
import ExtendedPageModel from './ExtendedPageModel'
import PageModel from './PageModel'

class PoiModel extends ExtendedPageModel {
  _location: LocationModel
  _excerpt: string

  constructor (params: {|
    path: string, title: string, content: string, thumbnail: string,
    availableLanguages: Map<string, string>, excerpt: string, location: LocationModel, lastUpdate: Moment,
    hash: string
  |}) {
    const { location, excerpt, ...other } = params
    super(other)
    this._location = location
    this._excerpt = excerpt
  }

  get location (): LocationModel {
    return this._location
  }

  get excerpt (): string {
    return this._excerpt
  }

  isEqual (other: PageModel): boolean {
    return other instanceof PoiModel &&
      super.isEqual(other) &&
      this.location.isEqual(other.location) &&
      this.excerpt === other.excerpt
  }
}

export default PoiModel
