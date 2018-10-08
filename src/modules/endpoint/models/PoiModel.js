// @flow

import type Moment from 'moment'
import LocationModel from './LocationModel'
import PageModel from './PageModel'

class PoiModel extends PageModel {
  _location: LocationModel

  constructor (params: {|id: number, path: string, title: string, content: string, thumbnail: string,
    availableLanguages: Map<string, string>, excerpt: string, location: LocationModel, lastUpdate: Moment|}) {
    const {location, ...other} = params
    super(other)
    this._location = location
  }

  get location (): LocationModel {
    return this._location
  }
}

export default PoiModel
