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

  /**
   * Returns a formatted string containing all relevant start and end date and time information
   * @param {String} locale The locale to format the span in
   * @return {String} The formatted span string
   */
  toFormattedString (locale: string): string {
    this._startDate.locale(locale)

    // if allDay: only date, else: date + time
    let span = this._allDay ? this._startDate.format('LL') : this._startDate.format('LLL')

    if (this._endDate.isValid() && !this._startDate.isSame(this._endDate)) {
      // endDate is valid and different from startDate

      this._endDate.locale(locale)
      if (this._startDate.isSame(this._endDate, 'day')) {
        // startDate and endDate are on the same day

        // if allDay: we don't need anything more, because we are on the same day, else: only time
        span += this._allDay ? '' : ` - ${this._endDate.format('LT')}`
      } else {
        // startDate and endDate are not on the same day

        span += ' - '
        // if allDay: only date, else: date + time
        span += this._allDay ? this._endDate.format('LL') : this._endDate.format('LLL')
      }
    }
    return span
  }
}

export default DateModel
