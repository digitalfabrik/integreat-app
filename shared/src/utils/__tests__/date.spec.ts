import { DateTime } from 'luxon'

import { formatDate, formatDateICal, formatTime, getWeekdayFromIndex } from '../date.ts'

jest.useFakeTimers({ now: new Date('2025-08-01T12:00:00.000+02:00') })

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
  it('should prefix the weekday and omit the year for a current-year date by default in German', () => {
    const date = DateTime.fromISO('2025-08-29T11:00:00+02:00')
    expect(formatDate(date, { locale: 'de' })).toBe('Fr., 29. Aug.')
  })

  it('should prefix the weekday and omit the year for a current-year date by default in English', () => {
    const date = DateTime.fromISO('2025-08-29T11:00:00+02:00')
    expect(formatDate(date, { locale: 'en' })).toBe('Fri, Aug 29')
  })

  it('should include the year automatically when the date is not in the current year', () => {
    const date = DateTime.fromISO('2026-08-29T11:00:00+02:00')
    expect(formatDate(date, { locale: 'de' })).toBe('Sa., 29. Aug. 2026')
  })

  it('should include the year when showYear is explicitly true even for the current year', () => {
    const date = DateTime.fromISO('2025-08-29T11:00:00+02:00')
    expect(formatDate(date, { locale: 'de', showYear: true })).toBe('Fr., 29. Aug. 2025')
  })

  it('should omit the year when showYear is explicitly false even for a non-current year', () => {
    const date = DateTime.fromISO('2026-08-29T11:00:00+02:00')
    expect(formatDate(date, { locale: 'de', showYear: false })).toBe('Sa., 29. Aug.')
  })
})

describe('getWeekdayFromIndex', () => {
  it('should return German weekdays', () => {
    expect(getWeekdayFromIndex(0, { locale: 'de' })).toBe('Montag')
    expect(getWeekdayFromIndex(4, { locale: 'de' })).toBe('Freitag')
    expect(getWeekdayFromIndex(6, { locale: 'de' })).toBe('Sonntag')
  })

  it('should return English weekdays', () => {
    expect(getWeekdayFromIndex(0, { locale: 'en' })).toBe('Monday')
    expect(getWeekdayFromIndex(4, { locale: 'en' })).toBe('Friday')
  })
})

describe('formatDateICal', () => {
  it('should return date in iCal format', () => {
    expect(formatDateICal(DateTime.fromISO('2023-10-09T07:00:00.000+02:00'))).toBe('20231009T070000')
  })

  it('should return date in iCal format when given a date in Arabic', () => {
    const arabicDate = DateTime.fromISO('2023-10-09T07:00:00.000+02:00', { locale: 'ar', numberingSystem: 'arab' })
    expect(formatDateICal(arabicDate)).toBe('20231009T070000')
  })
})
