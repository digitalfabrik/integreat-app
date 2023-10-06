import { DateTime } from 'luxon'
import { RRule as RRuleType } from 'rrule'

const MAX_RECURRENCE_YEARS = 5

class DateModel {
  _startDate: DateTime
  _endDate: DateTime
  _allDay: boolean
  _recurrenceRule: RRuleType | null

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
    const firstRecurrence = recurrenceRule?.after(DateTime.now().toJSDate())
    const duration = endDate.diff(startDate)
    this._allDay = allDay
    // If there is a recurrence rule, the start and end dates are not updated in the CMS and are therefore most of the time outdated
    // Therefore calculate the (next) correct start and end date based on the recurrence rule if available
    this._startDate = firstRecurrence ? DateTime.fromJSDate(firstRecurrence) : startDate
    this._endDate = firstRecurrence ? DateTime.fromJSDate(firstRecurrence).plus(duration) : endDate
    this._recurrenceRule = recurrenceRule
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
      .between(now.toJSDate(), maxDate, true, (_, index) => index < count)
      .map(it => DateTime.fromJSDate(it))
      .map(
        it =>
          new DateModel({
            allDay: this._allDay,
            startDate: it,
            endDate: it.plus(duration),
            recurrenceRule: null,
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

  isEqual(other: DateModel): boolean {
    return this.startDate.equals(other.startDate) && this.endDate.equals(other.endDate) && this.allDay === other.allDay
  }
}

export default DateModel
