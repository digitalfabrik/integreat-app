import { DateTime, Duration } from 'luxon'
import { RRule as RRuleType } from 'rrule'

const MAX_RECURRENCE_YEARS = 5

export type DateIcon = 'CalendarTodayRecurringIcon' | 'CalendarRecurringIcon' | 'CalendarTodayIcon'

class DateModel {
  _startDate: DateTime
  _endDate: DateTime
  _allDay: boolean
  _recurrenceRule: RRuleType | null
  _offset: number
  _duration: Duration

  constructor({
    startDate,
    endDate,
    allDay,
    recurrenceRule,
  }: {
    startDate: DateTime
    endDate: DateTime
    allDay: boolean
    recurrenceRule: RRuleType | null
  }) {
    this._recurrenceRule = recurrenceRule
    this._offset = startDate.offset
    this._allDay = allDay
    this._duration = endDate.diff(startDate)
    this._startDate = startDate
    this._endDate = endDate
  }

  // This should only be called on recurrences as start dates are not updated in the CMS
  // E.g. date.recurrences(1)[0]?.startDate
  get startDate(): DateTime {
    return this._startDate
  }

  // This should only be called on recurrences as end dates are not updated in the CMS
  // E.g. date.recurrences(1)[0]?.endDate
  get endDate(): DateTime {
    return this._endDate
  }

  get allDay(): boolean {
    return this._allDay
  }

  get recurrenceRule(): RRuleType | null {
    return this._recurrenceRule
  }

  get isToday(): boolean {
    const now = DateTime.now()
    return (
      this.startDate.hasSame(now, 'day') ||
      this.endDate.hasSame(now, 'day') ||
      (this.startDate <= now && this.endDate >= now)
    )
  }

  recurrences(count: number): DateModel[] {
    if (!this.recurrenceRule) {
      return [this]
    }

    const now = DateTime.now()
    const maxDate = now.plus({ years: MAX_RECURRENCE_YEARS }).toJSDate()
    const duration = this._endDate.diff(this._startDate)

    return this.recurrenceRule
      .between(this.currentDateToRrule(), maxDate, true, (_, index) => index < count)
      .map(it => this.rruleToDateTime(it))
      .map(
        it =>
          new DateModel({
            allDay: this._allDay,
            startDate: it,
            endDate: it.plus(duration),
            recurrenceRule: this.recurrenceRule,
          }),
      )
  }

  hasMoreRecurrencesThan(count: number): boolean {
    return this.recurrences(count + 1).length === count + 1
  }

  toFormattedString(locale: string, short = false): string {
    const dayFormat = short ? 'D' : 'DDD'
    const format = this.allDay ? dayFormat : `${dayFormat} t`
    const localizedStartDate = this.startDate.setLocale(locale).toFormat(format)
    const localizedEndDate = this.endDate.setLocale(locale)

    if (this.startDate.equals(this.endDate)) {
      return localizedStartDate
    }

    if (this.startDate.hasSame(this.endDate, 'day')) {
      return this.allDay ? localizedStartDate : `${localizedStartDate} - ${localizedEndDate.toFormat('t')}`
    }

    return `${localizedStartDate} - ${localizedEndDate.toFormat(format)}`
  }

  getDateIcon(): { icon: DateIcon; label: string } | null {
    const isRecurring = this.hasMoreRecurrencesThan(1)
    const isToday = this.isToday

    if (isRecurring && isToday) {
      return { icon: 'CalendarTodayRecurringIcon', label: 'todayRecurring' }
    }
    if (isRecurring) {
      return { icon: 'CalendarRecurringIcon', label: 'recurring' }
    }
    if (isToday) {
      return { icon: 'CalendarTodayIcon', label: 'today' }
    }
    return null
  }

  private rruleToDateTime(date: Date): DateTime {
    const dateTime = DateTime.fromJSDate(date)
    // rrule is not correctly handling timezones and always returning local time in the shape of UTC
    // Therefore we have to manually apply timezone offset, e.g. for daylight savings time
    // https://github.com/jkbrzt/rrule#important-use-utc-dates
    return dateTime.plus({ minutes: this._offset - dateTime.offset })
  }

  private currentDateToRrule(): Date {
    // rrule is not correctly handling timezones and is expecting dates in "local time", i.e. in the timezone of dstart
    // Therefore we have to manually apply timezone offset, e.g. for daylight savings time
    // https://github.com/jkbrzt/rrule#important-use-utc-dates
    // Also include dates happening at the moment by subtracting the duration
    return DateTime.now()
      .minus(this._duration)
      .minus({ minutes: this._offset - DateTime.now().offset })
      .toJSDate()
  }

  isEqual(other: DateModel): boolean {
    return this.startDate.equals(other.startDate) && this.endDate.equals(other.endDate) && this.allDay === other.allDay
  }
}

export default DateModel
