// @flow

import moment from 'moment'

class DateModel {
  _startDate: moment
  _endDate: moment
  _allDay: boolean

  constructor ({startDate, endDate, allDay}: {|startDate: moment, endDate: moment, allDay: boolean|}) {
    this._allDay = allDay
    this._startDate = startDate
    this._endDate = endDate
  }

  get startDate (): moment {
    return this._startDate
  }

  get endDate (): moment {
    return this._endDate
  }

  get allDay (): moment {
    return this._allDay
  }
}

export default DateModel
