// @flow

import type Moment from 'moment'
import LocationModel from './LocationModel'
import PoiModel from './PoiModel'
import DateModel from './DateModel'

class EventModel extends PoiModel {
  _date: DateModel

  constructor (params: {|id: number, path: string, title: string, content: string, thumbnail: string,
    date: DateModel, location: LocationModel, excerpt: string, availableLanguages: Map<string, string>,
    lastUpdate: Moment|}) {
    const {date, ...other} = params
    super(other)
    this._date = date
  }

  get date (): DateModel {
    return this._date
  }
}

export default EventModel
