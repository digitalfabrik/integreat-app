import { DateTime } from 'luxon'

import { formatDate, formatTime } from '../date.ts'

describe('formatTime', () => {
  it('should format a time in German using a 24h clock', () => {
    const time = DateTime.fromISO('2025-08-20T13:00:00+02:00')
    expect(formatTime(time, { locale: 'de' })).toBe('13:00')
  })

  it('should format a time in English using a 12h clock', () => {
    const time = DateTime.fromISO('2025-08-20T13:00:00+02:00')
    expect(formatTime(time, { locale: 'en' })).toBe('1:00 PM')
  })
})

describe('formatDate', () => {
  it('should format a date with year by default in German', () => {
    const date = DateTime.fromISO('2025-08-29T11:00:00+02:00')
    expect(formatDate(date, { locale: 'de' })).toBe('29. Aug. 2025')
  })

  it('should format a date with year in English', () => {
    const date = DateTime.fromISO('2025-08-29T11:00:00+02:00')
    expect(formatDate(date, { locale: 'en' })).toBe('Aug 29, 2025')
  })

  it('should omit the year when showYear is false', () => {
    const date = DateTime.fromISO('2025-08-29T11:00:00+02:00')
    expect(formatDate(date, { locale: 'de', showYear: false })).toBe('29. Aug.')
  })
})
