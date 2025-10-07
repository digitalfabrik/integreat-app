import { DateTime } from 'luxon'

import { DateModel } from '../../api'
import { formatTime, getWeekdayFromIndex } from '../date'

const t = (key: string, options?: Record<string, unknown>) =>
  options
    ? `${key}, ${Object.entries(options)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ')}`
    : key

describe('getWeekdayFromIndex', () => {
  it('should return the correct weekday', () => {
    expect(getWeekdayFromIndex(0, 'de')).toBe('Montag')
    expect(getWeekdayFromIndex(3, 'de')).toBe('Donnerstag')
    expect(getWeekdayFromIndex(2, 'en')).toBe('Wednesday')
    expect(getWeekdayFromIndex(5, 'en')).toBe('Saturday')
  })
})

describe('formatTime', () => {
  jest.useFakeTimers({ now: new Date('2023-10-09T15:23:57.443+02:00') })

  it('should format a time interval correctly', () => {
    const locale = 'de'
    const date = new DateModel({
      startDate: DateTime.fromISO('2025-08-20T11:00:00+02:00', { locale }),
      endDate: DateTime.fromISO('2025-08-20T13:00:00+02:00', { locale }),
      allDay: false,
      recurrenceRule: null,
      onlyWeekdays: false,
    })
    expect(formatTime(locale, date, t)).toBe('timeRange, startTime: 11:00, endTime: 13:00')
  })

  it('should format an all-day event correctly', () => {
    const locale = 'de'
    const date = new DateModel({
      startDate: DateTime.fromISO('2025-08-20T00:00:00+02:00', { locale }),
      endDate: DateTime.fromISO('2025-08-20T23:59:00+02:00', { locale }),
      allDay: true,
      recurrenceRule: null,
      onlyWeekdays: false,
    })
    expect(formatTime(locale, date, t)).toBe('pois:allDay')
  })
})
