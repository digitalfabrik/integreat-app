// @flow

import type Moment from 'moment'

class DateModel {
  _startDate: Moment
  _endDate: Moment
  _allDay: boolean

  constructor ({startDate, endDate, allDay}: {|startDate: Moment, endDate: Moment, allDay: boolean|}) {
    this._allDay = allDay
    this._startDate = startDate
    this._endDate = endDate
  }

  get startDate (): Moment {
    return this._startDate
  }

  get endDate (): Moment {
    return this._endDate
  }

  get allDay (): boolean {
    return this._allDay
  }
}

export default DateModel
