import { DateTime, DateTimeFormatOptions } from 'luxon'

export const getWeekdayFromIndex = (index: number, locale: string): string => {
  // Use a day that we know to be a Monday, add ${index} days to it, then return that day's weekday translation
  const baseMonday = DateTime.fromObject({ day: 22, month: 9, year: 2025 })
  const weekday = baseMonday.plus({ days: index })
  return weekday.toLocaleString({ weekday: 'long' }, { locale })
}

export type TranslateFunction = (key: string, options?: Record<string, unknown>) => string

type DateType = {
  startDate: DateTime
  endDate: DateTime | null
  allDay: boolean
}
const timeFormat: DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit' }

export const formatTime = (locale: string, date: DateType, t: TranslateFunction): string => {
  const startTime = date.startDate.toLocaleString(timeFormat, { locale })

  const startIsSameAsEnd =
    date.endDate !== null &&
    date.startDate.hasSame(date.endDate, 'hour') &&
    date.startDate.hasSame(date.endDate, 'minute')
  if (!date.endDate || startIsSameAsEnd) {
    return startTime
  }

  // For long-term events, we need the end date's time but on the start date
  const endTime = date.startDate
    .set({ hour: date.endDate.hour, minute: date.endDate.minute })
    .toLocaleString(timeFormat, { locale })
  return date.allDay ? t('pois:allDay') : `${startTime} - ${endTime}`
}

export const formatDateICal = (date: DateTime): string =>
  // DateTime.toFormat() does not respect the locale settings on some devices
  // Therefore hackily convert an ISO date to ICal format
  // https://github.com/digitalfabrik/integreat-app/pull/3158#pullrequestreview-2935063754
  date.toISO().replace(/-/g, '').replace(/:/g, '').replace(/\..*/, '')
