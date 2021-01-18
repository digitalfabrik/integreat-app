// @flow

import type Moment from 'moment'
import Formatter from '../i18n/Formatter'

class DateModel {
  _startDate: Moment
  _endDate: Moment
  _allDay: boolean

  constructor ({
    startDate,
    endDate,
    allDay
  }: {| startDate: Moment, endDate: Moment, allDay: boolean |}) {
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
   * @param {MomentFormatterType} formatter formats the string according to the correct locale
   * @return {String} The formatted span string
   */
  toFormattedString (formatter: Formatter): string {
    // if allDay: only date, else: date + time
    let span = this._allDay
      ? formatter.format(this._startDate, { format: 'LL' })
      : formatter.format(this._startDate, { format: 'LLL' })

    if (this._endDate.isValid() && !this._startDate.isSame(this._endDate)) {
      // endDate is valid and different from startDate
      if (this._startDate.isSame(this._endDate, 'day')) {
        // startDate and endDate are on the same day

        // if allDay: we don't need anything more, because we are on the same day, else: only time
        span += this._allDay ? '' : ` - ${formatter.format(this._endDate, { format: 'LT' })}`
      } else {
        // startDate and endDate are not on the same day

        span += ' - '
        // if allDay: only date, else: date + time
        span += this._allDay
          ? formatter.format(this._endDate, { format: 'LL' })
          : formatter.format(this._endDate, { format: 'LLL' })
      }
    }
    return span
  }

  isEqual (other: DateModel): boolean {
    return this.startDate.isSame(other.startDate) &&
      this.endDate.isSame(other.endDate) &&
      this.allDay === other.allDay
  }
}

export default DateModel
