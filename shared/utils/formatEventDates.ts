import { DateTime, Info, Interval } from 'luxon'
import { RRule as RRuleType } from 'rrule'

import { DateModel } from '../api'

const MAX_RECURRENCES = 5

type FormattedEventDate = {
  date: string
  weekday: string | undefined
  time: string
}

export const getWeekdaysFromIndices = (indices: number[], locale: string): string => {
  const weekdays = Info.weekdays('long', { locale })
  return indices.map(index => weekdays[index]).join(', ')
}

export const formatDateInterval = (startDate: DateTime, endDate: DateTime | null): string => {
  if (!endDate) {
    return startDate.toLocaleString(DateTime.DATE_FULL)
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

const formatEventDates = (
  date: DateModel,
  t: (key: string, options?: Record<string, unknown>) => string,
): { dates: FormattedEventDate[]; hasMoreDates: boolean } => {
  let formattedDate = ''
  let weekday: string | undefined
  if (date.recurrenceRule) {
    const recurrenceObject = date.recurrenceRule.options
    // monthly and yearly recurrences show up as several dates
    if (recurrenceObject.freq === RRuleType.MONTHLY || recurrenceObject.freq === RRuleType.YEARLY) {
      const now = DateTime.now().setLocale(date.startDate.locale) // TODO: Is it necessary to set the locale or is that only for the test?
      const occurrences = date.recurrences(MAX_RECURRENCES, now)
      const hasMoreDates = date.hasMoreRecurrencesThan(MAX_RECURRENCES)
      return {
        dates: occurrences.map(occurrence => ({
          date: occurrence.startDate.toLocaleString({
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
          weekday: undefined,
          time: formatTime(date, t),
        })),
        hasMoreDates,
      }
    }
    if (recurrenceObject.until) {
      const finalJsDate = date.recurrenceRule.before(recurrenceObject.until, true)
      const finalDate = finalJsDate ? DateTime.fromJSDate(finalJsDate) : null
      formattedDate = formatDateInterval(date.startDate, finalDate)
    } else {
      formattedDate = t('startingFrom', { date: date.startDate.toLocaleString(DateTime.DATE_FULL) })
    }
    weekday = getWeekdaysFromIndices(recurrenceObject.byweekday, date.startDate.locale)
  } else if (date.startDate.hasSame(date.endDate, 'day')) {
    formattedDate = date.startDate.toLocaleString(DateTime.DATE_FULL)
  } else {
    // long-term event
    formattedDate = formatDateInterval(date.startDate, date.endDate)
    if (date.onlyWeekdays) {
      weekday = translateMondayToFriday(date.startDate.locale)
    }
  }

  const time = formatTime(date, t)

  return {
    dates: [
      {
        date: formattedDate,
        weekday,
        time,
      },
    ],
    hasMoreDates: false, // TODO: Do we need the hasMoreDates here or can we just call hasMoreRecurrencesThan(5) elsewhere?
  }
}

export default formatEventDates
