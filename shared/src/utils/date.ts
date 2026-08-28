import { DateTime } from 'luxon'

type FormatOptions = {
  locale: string
}

export const getWeekdayFromIndex = (index: number, { locale }: FormatOptions): string => {
  // Use a day that we know to be a Monday, add ${index} days to it, then return that day's weekday translation
  const baseMonday = DateTime.fromObject({ day: 22, month: 9, year: 2025 })
  const weekday = baseMonday.plus({ days: index })
  return weekday.toLocaleString({ weekday: 'long' }, { locale })
}

export const formatTime = (time: DateTime, { locale }: FormatOptions): string =>
  time.toLocaleString({ hour: 'numeric', minute: '2-digit' }, { locale })

type FormatDateOptions = FormatOptions & {
  showYear?: boolean
}

export const formatDate = (date: DateTime, { locale, showYear }: FormatDateOptions): string => {
  const isCurrentYear = date.hasSame(DateTime.now(), 'year')
  return date.toLocaleString(
    { day: 'numeric', month: 'short', year: (showYear ?? !isCurrentYear) ? 'numeric' : undefined, weekday: 'short' },
    { locale },
  )
}

export const formatDateICal = (date: DateTime): string =>
  // DateTime.toFormat() does not respect the locale settings on some devices
  // Therefore hackily convert an ISO date to ICal format
  // https://github.com/digitalfabrik/integreat-app/pull/3158#pullrequestreview-2935063754
  date.toISO().replace(/-/g, '').replace(/:/g, '').replace(/\..*/, '')
