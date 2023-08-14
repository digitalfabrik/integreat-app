import { DateTime } from 'luxon'

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

  toFormattedString(locale: string): string {
    const format = this.allDay ? 'DDD' : 'DDD t'
    const localizedStartDate = this.startDate.setLocale(locale).toFormat(format)
    const localizedEndDate = this.endDate.setLocale(locale)

    if (this.startDate.equals(this.endDate)) {
      return localizedStartDate
    }

    if (this.startDate.hasSame(this.endDate, 'day')) {
      return this.allDay ? localizedStartDate : `${localizedStartDate} - ${localizedEndDate.toFormat('t')}`
    }

    // startDate and endDate are not on the same day
    return `${localizedStartDate} - ${localizedEndDate.toFormat(format)}`
  }

  isEqual(other: DateModel): boolean {
    return this.startDate.equals(other.startDate) && this.endDate.equals(other.endDate) && this.allDay === other.allDay
  }
}

export default DateModel
