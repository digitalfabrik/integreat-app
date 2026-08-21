import { DateTime } from 'luxon'

export const formatTime = (time: DateTime, { locale }: { locale: string }): string =>
  time.toLocaleString({ hour: 'numeric', minute: '2-digit' }, { locale })

type FormatDateOptions = {
  locale: string
  showYear?: boolean
}

export const formatDate = (date: DateTime, { locale, showYear = true }: FormatDateOptions): string =>
  date.toLocaleString({ day: 'numeric', month: 'short', year: showYear ? 'numeric' : undefined }, { locale })

export const formatDateICal = (date: DateTime): string =>
  // DateTime.toFormat() does not respect the locale settings on some devices
  // Therefore hackily convert an ISO date to ICal format
  // https://github.com/digitalfabrik/integreat-app/pull/3158#pullrequestreview-2935063754
  date.toISO().replace(/-/g, '').replace(/:/g, '').replace(/\..*/, '')
