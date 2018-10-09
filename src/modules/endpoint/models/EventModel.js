// @flow

import type Moment from 'moment'
import LocationModel from './LocationModel'
import DateModel from './DateModel'
import PageModel from './PageModel'

class EventModel extends PageModel {
  _date: DateModel
  _location: LocationModel

  constructor (params: {|id: number, path: string, title: string, content: string, thumbnail: string,
    date: DateModel, location: LocationModel, excerpt: string, availableLanguages: Map<string, string>,
    lastUpdate: Moment|}) {
    const {date, location, ...other} = params
    super(other)
    this._date = date
    this._location = location
  }

  get date (): DateModel {
    return this._date
  }

  get location (): LocationModel {
    return this._location
  }
}

export default EventModel
