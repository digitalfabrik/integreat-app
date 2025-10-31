import { DateTime, DateTimeFormatOptions } from 'luxon'

import { DateModel } from '../api'
import { TranslateFunction } from '../api/models/DateModel'

export const getWeekdayFromIndex = (index: number, locale: string): string => {
  // Use a day that we know to be a Monday, add ${index} days to it, then return that day's weekday translation
  const baseMonday = DateTime.fromObject({ day: 22, month: 9, year: 2025 })
  const weekday = baseMonday.plus({ days: index })
  return weekday.toLocaleString({ weekday: 'long' }, { locale })
}

const timeFormat: DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit' }

export const formatTime = (locale: string, date: DateModel, t: TranslateFunction): string => {
  const startTime = date.startDate.toLocaleString(timeFormat, { locale })

  const startIsSameAsEnd =
    date.endDate !== null &&
    date.startDate.hasSame(date.endDate, 'hour') &&
    date.startDate.hasSame(date.endDate, 'minute')
  if (!date.endDate || startIsSameAsEnd) {
    return t('time', { startTime })
  }

  // For long-term events, we need the end date's time but on the start date
  const endTime = date.startDate
    .set({ hour: date.endDate.hour, minute: date.endDate.minute })
    .toLocaleString(timeFormat, { locale })
  return date.allDay ? t('pois:allDay') : t('timeRange', { startTime, endTime })
}
