import { DateTime, DateTimeFormatOptions, Duration } from 'luxon'
import { RRule as RRuleType, rrulestr } from 'rrule'

import { formatDateICal } from '../../utils'
import { formatTime, getWeekdayFromIndex } from '../../utils/date'

const MAX_RECURRENCE_YEARS = 6

export type DateIcon = 'CalendarTodayRecurringIcon' | 'CalendarRecurringIcon' | 'CalendarTodayIcon'

type TranslateFunction = (key: string, options?: Record<string, unknown>) => string

type FormattedEventDate = {
  date: string
  weekday: string | undefined
  time: string
}

const dateFormatWithoutWeekday: DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }
const dateFormatWithWeekday: DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }

class DateModel {
  _startDate: DateTime
  _endDate: DateTime
  _allDay: boolean
  _recurrenceRule: RRuleType | null
  _duration: Duration
  _onlyWeekdays: boolean

  constructor({
    startDate,
    endDate,
    allDay,
    recurrenceRule,
    onlyWeekdays,
  }: {
    startDate: DateTime
    endDate: DateTime
    allDay: boolean
    recurrenceRule: RRuleType | null
    offset?: number
    onlyWeekdays: boolean
  }) {
    this._recurrenceRule = recurrenceRule
    this._allDay = allDay
    this._duration = endDate.diff(startDate)
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
  get endDate(): DateTime {
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
      this.endDate.hasSame(now, 'day') ||
      (this.startDate <= now && this.endDate >= now)
    )
  }

  recurrences(count: number, filterStartDate?: DateTime | null, filterEndDate?: DateTime | null): DateModel[] {
    if (!this.recurrenceRule) {
      return [this]
    }

    const now = DateTime.now()
    const duration = this._endDate.diff(this._startDate)
    const startDate = filterStartDate && filterStartDate > now ? filterStartDate : now
    const minDate = startDate.minus(duration).minus({ minutes: startDate.offset }).toJSDate() // to also include events that are happening right now
    const maxDate = (filterEndDate ?? now.plus({ years: MAX_RECURRENCE_YEARS })).toJSDate()

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
          endDate: actualDate.plus(duration),
          recurrenceRule: this.recurrenceRule,
          onlyWeekdays: this.onlyWeekdays,
        })
      })
  }

  hasMoreRecurrencesThan(count: number): boolean {
    return this.recurrences(count + 1).length === count + 1
  }

  isSingleOneDayEvent(): boolean {
    return this.startDate.hasSame(this.endDate, 'day') && !this.recurrenceRule
  }

  isMonthlyOrYearlyRecurrence(): boolean {
    if (!this.recurrenceRule) {
      return false
    }
    const frequency = this.recurrenceRule.options.freq
    return frequency === RRuleType.MONTHLY || frequency === RRuleType.YEARLY
  }

  formatMonthlyOrYearlyRecurrence(locale: string, t: TranslateFunction): FormattedEventDate {
    return {
      date: this.startDate.toLocaleString(dateFormatWithWeekday, { locale }),
      weekday: undefined,
      time: formatTime(locale, this, t),
    }
  }

  formatEventDate(locale: string, t: TranslateFunction): FormattedEventDate {
    const time = formatTime(locale, this, t)
    const weekday = this.onlyWeekdays
      ? `${getWeekdayFromIndex(0, locale)} - ${getWeekdayFromIndex(4, locale)}`
      : undefined

    if (this.recurrenceRule) {
      return this.formatRecurringDate(locale, this, t)
    }

    if (this.isSingleOneDayEvent()) {
      return {
        date: this.startDate.toLocaleString(dateFormatWithoutWeekday, { locale }),
        weekday,
        time,
      }
    }

    // long-term event
    return {
      date: this.formatDateInterval(locale, this.endDate),
      weekday,
      time,
    }
  }

  formatEventDateInOneLine(locale: string, t: TranslateFunction): string {
    const now = DateTime.now()
    const showYear =
      !now.hasSame(this.startDate, 'year') || !now.hasSame(this.getFinalDate(this) || this.endDate, 'year')
    const format: DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: showYear ? 'numeric' : undefined,
    }
    if (this.isSingleOneDayEvent()) {
      return `${this.startDate.toLocaleString(format, { locale })}, ${formatTime(locale, this, t)}`
    }
    if (!this.recurrenceRule) {
      return this.formatDateInterval(locale, this.endDate, !showYear)
    }
    const finalDate = this.getFinalDate(this)
    if (finalDate) {
      return this.formatDateInterval(locale, finalDate, !showYear)
    }
    return t('startingFrom', {
      date: this.startDate.toLocaleString(format, { locale }),
    })
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
    return this.startDate.equals(other.startDate) && this.endDate.equals(other.endDate) && this.allDay === other.allDay
  }

  private getFinalDate(date: DateModel): DateTime | null {
    if (!date.recurrenceRule?.options.until) {
      return null
    }
    const localRecurrenceRule = date.getRecurrenceRuleInLocalTime(date.recurrenceRule)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const finalJsDate = localRecurrenceRule.before(localRecurrenceRule.options.until!, true)
    finalJsDate?.setHours(date.endDate.hour, date.endDate.minute)
    return finalJsDate ? DateTime.fromJSDate(finalJsDate) : null
  }

  private formatDateInterval(locale: string, finalDate: DateTime | null, hideYear?: boolean): string {
    const format: DateTimeFormatOptions = hideYear ? { day: 'numeric', month: 'long' } : dateFormatWithoutWeekday
    const formattedStartDate = this.startDate.toLocaleString(format, { locale })
    if (!finalDate || this.startDate.hasSame(finalDate, 'day')) {
      return formattedStartDate
    }
    const formattedEndDate = finalDate.toLocaleString(format, { locale })
    return `${formattedStartDate} - ${formattedEndDate}`
  }

  private formatRecurringDate(locale: string, date: DateModel, t: TranslateFunction): FormattedEventDate {
    if (!date.recurrenceRule) {
      throw new Error('DateModel has no recurrence rule')
    }

    const recurrenceObject = date.recurrenceRule.options
    const weekday = recurrenceObject.byweekday.map(index => getWeekdayFromIndex(index, locale)).join(', ')
    const time = formatTime(locale, date, t)

    if (recurrenceObject.until) {
      const finalDate = this.getFinalDate(date)
      return {
        date: this.formatDateInterval(locale, finalDate),
        weekday,
        time,
      }
    }

    return {
      date: t('startingFrom', {
        date: date.startDate.toLocaleString(dateFormatWithoutWeekday, { locale }),
      }),
      weekday,
      time,
    }
  }
}

export default DateModel
