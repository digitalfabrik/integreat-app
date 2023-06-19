import { DateTime } from 'luxon'

import DateFormatter from '../i18n/DateFormatter'

class DateModel {
  _startDate: DateTime
  _endDate: DateTime
  _allDay: boolean

  constructor({ startDate, endDate, allDay }: { startDate: DateTime; endDate: DateTime; allDay: boolean }) {
    this._allDay = allDay
    this._startDate = startDate
    this._endDate = endDate
  }

  get startDate(): DateTime {
    return this._startDate
  }

  get endDate(): DateTime {
    return this._endDate
  }

  get allDay(): boolean {
    return this._allDay
  }

  /**
   * Returns a formatted string containing all relevant start and end date and time information
   * @param {DateFormatter} formatter formats the string according to the correct locale
   * @return {String} The formatted span string
   */
  toFormattedString(formatter: DateFormatter): string {
    // if allDay: only date, else: date + time
    let span = this._allDay
      ? formatter.format(this._startDate, {
          format: 'DDD',
        })
      : formatter.format(this._startDate, {
          format: 'ff',
        })

    if (this._endDate.isValid && !this._startDate.hasSame(this._endDate, 'day')) {
      // endDate is valid and different from startDate
      if (this._startDate.hasSame(this._endDate, 'day')) {
        // startDate and endDate are on the same day
        // if allDay: we don't need anything more, because we are on the same day, else: only time
        span += this._allDay
          ? ''
          : ` - ${formatter.format(this._endDate, {
              format: 't',
            })}`
      } else {
        // startDate and endDate are not on the same day
        span += ' - '
        // if allDay: only date, else: date + time
        span += this._allDay
          ? formatter.format(this._endDate, {
              format: 'DDD',
            })
          : formatter.format(this._endDate, {
              format: 'ff',
            })
      }
    }

    return span
  }

  isEqual(other: DateModel): boolean {
    return (
      this.startDate.hasSame(other.startDate, 'day') &&
      this.endDate.hasSame(other.endDate, 'day') &&
      this.allDay === other.allDay
    )
  }
}

export default DateModel
