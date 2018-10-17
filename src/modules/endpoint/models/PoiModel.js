// @flow

import type Moment from 'moment'
import LocationModel from './LocationModel'
import PageModel from './PageModel'

class PoiModel extends PageModel {
  _location: LocationModel
  _excerpt: string

  constructor (params: {|id: number, path: string, title: string, content: string, thumbnail: string,
    availableLanguages: Map<string, string>, excerpt: string, location: LocationModel, lastUpdate: Moment|}) {
    const {location, excerpt, ...other} = params
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
}

export default PoiModel
