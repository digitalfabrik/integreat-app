import { DateTime, Duration, Info, Interval } from 'luxon'
import { RRule as RRuleType, rrulestr } from 'rrule'

import { formatDateICal } from '../../utils'

const MAX_RECURRENCE_YEARS = 6

export type DateIcon = 'CalendarTodayRecurringIcon' | 'CalendarRecurringIcon' | 'CalendarTodayIcon'

type FormattedEventDate = {
  date: string
  weekday: string | undefined
  time: string
}

export const getWeekdaysFromIndices = (indices: number[], locale: string): string => {
  const weekdays = Info.weekdays('long', { locale })
  return indices.map(index => weekdays[index]).join(', ')
}

export const formatDateInterval = (startDate: DateTime, endDate?: DateTime | null): string => {
  if (!endDate) {
    return startDate.toLocaleString({ day: 'numeric', month: 'long', year: 'numeric' })
  }
  const interval = Interval.fromDateTimes(startDate, endDate)
  return interval.toLocaleString({ month: 'long', day: 'numeric', year: 'numeric' })
}

export const formatTime = (date: DateModel, t: (key: string) => string): string => {
  // For long-term events, the endDate is on the last day, but we need the end time on the first day
  const endDate = date.startDate.set({ hour: date.endDate.hour, minute: date.endDate.minute })
  const interval = Interval.fromDateTimes(date.startDate, endDate)
  return date.allDay ? t('pois:allDay') : interval.toLocaleString({ hour: 'numeric', minute: '2-digit' })
}

export const translateMondayToFriday = (locale: string): string => {
  const randomMondayToFriday = Interval.fromDateTimes(
    DateTime.fromObject({ day: 8, month: 9, year: 2025 }).setLocale(locale),
    DateTime.fromObject({ day: 12, month: 9, year: 2025 }).setLocale(locale),
  )
  return randomMondayToFriday.toLocaleString({ weekday: 'long' })
}

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
        const actualDate = DateTime.fromJSDate(offsetDate).toUTC().setLocale(this.startDate.locale)
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

  isMonthlyOrYearlyRecurrence(): boolean {
    if (!this.recurrenceRule) {
      return false
    }
    const frequency = this.recurrenceRule.options.freq
    return frequency === RRuleType.MONTHLY || frequency === RRuleType.YEARLY
  }

  formatMonthlyOrYearlyRecurrence(t: (key: string, options?: Record<string, unknown>) => string): FormattedEventDate {
    return {
      date: this.startDate.toLocaleString({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
      weekday: undefined,
      time: formatTime(this, t),
    }
  }

  private formatRecurringDate(
    date: DateModel,
    t: (key: string, options?: Record<string, unknown>) => string,
  ): FormattedEventDate {
    if (!date.recurrenceRule) {
      throw new Error('DateModel has no recurrence rule')
    }
    let formattedDate = ''
    const recurrenceObject = date.recurrenceRule.options
    if (recurrenceObject.until) {
      const finalDate = this.getFinalDate(date)
      formattedDate = formatDateInterval(date.startDate, finalDate)
    } else {
      formattedDate = t('startingFrom', {
        date: date.startDate.toLocaleString({ day: 'numeric', month: 'long', year: 'numeric' }),
      })
    }
    const weekday = getWeekdaysFromIndices(recurrenceObject.byweekday, date.startDate.locale)
    const time = formatTime(date, t)

    return {
      date: formattedDate,
      weekday,
      time,
    }
  }

  formatEventDate(t: (key: string, options?: Record<string, unknown>) => string): FormattedEventDate {
    let formattedDate = ''
    let weekday: string | undefined

    if (this.recurrenceRule) {
      return this.formatRecurringDate(this, t)
    }
    if (this.startDate.hasSame(this.endDate, 'day')) {
      formattedDate = this.startDate.toLocaleString({ day: 'numeric', month: 'long', year: 'numeric' })
    } else {
      // long-term event
      formattedDate = formatDateInterval(this.startDate, this.endDate)
      if (this.onlyWeekdays) {
        weekday = translateMondayToFriday(this.startDate.locale)
      }
    }

    const time = formatTime(this, t)

    return {
      date: formattedDate,
      weekday,
      time,
    }
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
    if (!date.recurrenceRule || !date.recurrenceRule.options.until) {
      return null
    }
    const localRecurrenceRule = date.getRecurrenceRuleInLocalTime(date.recurrenceRule)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const finalJsDate = localRecurrenceRule.before(localRecurrenceRule.options.until!, true)
    finalJsDate?.setHours(date.endDate.hour, date.endDate.minute)
    return finalJsDate ? DateTime.fromJSDate(finalJsDate) : null
  }
}

export default DateModel
