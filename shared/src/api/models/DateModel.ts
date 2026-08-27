import { TFunction } from 'i18next'
import { DateTime, Duration } from 'luxon'
import { RRule as RRuleType, rrulestr } from 'rrule'

import { formatDate, formatDateICal, formatTime } from '../../utils/date.ts'

const MAX_RECURRENCE_YEARS = 6

class DateModel {
  _startDate: DateTime
  _endDate: DateTime | null
  _allDay: boolean
  _recurrenceRule: RRuleType | null
  _duration: Duration | undefined
  _onlyWeekdays: boolean

  constructor({
    startDate,
    endDate,
    allDay,
    recurrenceRule,
    onlyWeekdays,
  }: {
    startDate: DateTime
    endDate: DateTime | null
    allDay: boolean
    recurrenceRule: RRuleType | null
    offset?: number
    onlyWeekdays: boolean
  }) {
    this._recurrenceRule = recurrenceRule
    this._allDay = allDay
    this._duration = endDate?.diff(startDate)
    this._startDate = startDate
    this._endDate = endDate
    this._onlyWeekdays = onlyWeekdays
  }
  // This should only be called on recurrences as start dates are not updated in the CMS
  // E.g. date.recurrences(1)[0]?.startDate
  get startDate(): DateTime {
    return this._startDate
  }

  // This should only be called on recurrences as end dates are not updated in the CMS
  // E.g. date.recurrences(1)[0]?.endDate
  get endDate(): DateTime | null {
    return this._endDate
  }

  get allDay(): boolean {
    return this._allDay
  }

  get recurrenceRule(): RRuleType | null {
    return this._recurrenceRule
  }

  get onlyWeekdays(): boolean {
    return this._onlyWeekdays
  }

  get isToday(): boolean {
    const now = DateTime.now()
    return (
      this.startDate.hasSame(now, 'day') ||
      this.endDate?.hasSame(now, 'day') ||
      (this.startDate <= now && this.endDate !== null && this.endDate >= now)
    )
  }

  recurrences(count: number, filterStartDate?: DateTime | null, filterEndDate?: DateTime | null): DateModel[] {
    if (!this.recurrenceRule) {
      return [this]
    }

    const now = DateTime.now()
    const duration = this._endDate?.diff(this._startDate)
    const startOfToday = now.startOf('day')
    const rangeStart = filterStartDate && filterStartDate > startOfToday ? filterStartDate : startOfToday

    // The rrule package treats all times as UTC
    // Subtracting the duration also includes events that are happening right now.
    const minDate = rangeStart
      .minus(duration ?? 0)
      .setZone('utc', { keepLocalTime: true })
      .toJSDate()
    const maxDate = (filterEndDate ?? now.plus({ years: MAX_RECURRENCE_YEARS }))
      .setZone('utc', { keepLocalTime: true })
      .toJSDate()

    // The rrule package considers all times to be in UTC time zones and ignores time zone offsets
    // So we manually subtract the offset before getting the recurrences and add it back in after
    // If we don't subtract the offset for the recurrences, we get the wrong date if the offset is
    // bigger than the distance from midnight (e.g. 1 am with a 2h offset during CET summer time)
    // https://github.com/jkbrzt/rrule#important-use-utc-dates
    const localRecurrenceRule = this.getRecurrenceRuleInLocalTime(this.recurrenceRule)

    return localRecurrenceRule
      .between(minDate, maxDate, true, (_, index) => index < count)
      .map(offsetDate => {
        const actualDate = DateTime.fromJSDate(offsetDate).toUTC()
        return new DateModel({
          allDay: this.allDay,
          startDate: actualDate,
          endDate: actualDate.plus(duration ?? 0),
          recurrenceRule: this.recurrenceRule,
          onlyWeekdays: this.onlyWeekdays,
        })
      })
  }

  firstRecurrenceInRange(startDate: DateTime | null, endDate: DateTime | null): DateModel {
    const recurrences = this.recurrences(
      1,
      startDate?.startOf('day') ?? DateTime.now().startOf('day'),
      endDate?.endOf('day') ?? null,
    )

    return recurrences[0] ?? this
  }

  hasMoreRecurrencesThan(count: number): boolean {
    return this.recurrences(count + 1).length === count + 1
  }

  isSingleDay(): boolean {
    return !this.endDate || this.startDate.hasSame(this.endDate, 'day')
  }

  formatDateInterval(locale: string): string {
    const now = DateTime.now()
    const showYear = !this.startDate.hasSame(now, 'year') || (this.endDate ? !this.endDate.hasSame(now, 'year') : false)

    const formattedStartDate = formatDate(this.startDate, { locale, showYear })
    return !this.endDate || this.isSingleDay()
      ? formattedStartDate
      : `${formattedStartDate} - ${formatDate(this.endDate, { locale, showYear })}`
  }

  formatTimeInterval(locale: string, { t }: { t: TFunction }): string {
    if (this.allDay) {
      return t($ => $.places.allDay)
    }

    const startTime = formatTime(this.startDate, { locale })

    if (!this.endDate || this.startDate.hasSame(this.endDate, 'minute')) {
      return startTime
    }

    const endTime = formatTime(this.endDate, { locale })
    return `${startTime} - ${endTime}`
  }

  private getRecurrenceRuleInLocalTime(recurrenceRule: RRuleType): RRuleType {
    const startDate = recurrenceRule.options.dtstart
    const offsetStartDate = formatDateICal(
      DateTime.fromJSDate(startDate).minus({ minutes: startDate.getTimezoneOffset() }).toUTC(),
    )
    const regexForFindingDate = /\d{8}T\d{6}/
    // Don't parse by the recurrenceRule options here, rrule doesn't properly parse the params for every nth day of the month
    // https://github.com/jkbrzt/rrule/issues/326
    return rrulestr(recurrenceRule.toString().replace(regexForFindingDate, offsetStartDate))
  }

  isEqual(other: DateModel): boolean {
    return (
      this.startDate.toISO() === other.startDate.toISO() &&
      this.endDate?.toISO() === other.endDate?.toISO() &&
      this.allDay === other.allDay
    )
  }
}

export default DateModel
