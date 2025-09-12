import { DateTime } from 'luxon'
import { rrulestr } from 'rrule'

import { DateModel } from '../../api'
import formatEventDates, {
  getWeekdaysFromIndices,
  formatDateInterval,
  formatTime,
  translateMondayToFriday,
} from '../formatEventDates'

const t = (key: string, options?: Record<string, unknown>) =>
  options
    ? `${key}, ${Object.entries(options)
        .map(option => `${option[0]}: ${option[1]}`)
        .join(', ')}`
    : key

describe('formatEventDates', () => {
  it('should format a one-time, not all-day event correctly', () => {
    const date = new DateModel({
      startDate: DateTime.fromISO('2025-08-29T11:00:00+02:00', { locale: 'de' }),
      endDate: DateTime.fromISO('2025-08-29T13:00:00+02:00', { locale: 'de' }),
      allDay: false,
      recurrenceRule: null,
      onlyWeekdays: false,
    })
    expect(formatEventDates(date, t)).toStrictEqual({
      dates: [
        {
          date: '29. August 2025',
          weekday: undefined,
          time: '11:00–13:00 Uhr',
        },
      ],
      hasMoreDates: false,
    })
  })

  it('should format a one-time, not all-day event correctly in English', () => {
    const date = new DateModel({
      startDate: DateTime.fromISO('2025-08-29T11:00:00+02:00', { locale: 'en' }),
      endDate: DateTime.fromISO('2025-08-29T13:00:00+02:00', { locale: 'en' }),
      allDay: false,
      recurrenceRule: null,
      onlyWeekdays: false,
    })
    expect(formatEventDates(date, t)).toStrictEqual({
      dates: [
        {
          date: 'August 29, 2025',
          weekday: undefined,
          time: '11:00 AM – 1:00 PM',
        },
      ],
      hasMoreDates: false,
    })
  })

  it('should format a one-time, all-day event correctly', () => {
    const date = new DateModel({
      startDate: DateTime.fromISO('2025-09-03T00:00:00+02:00', { locale: 'de' }),
      endDate: DateTime.fromISO('2025-09-03T23:59:00+02:00', { locale: 'de' }),
      allDay: true,
      recurrenceRule: null,
      onlyWeekdays: false,
    })
    expect(formatEventDates(date, t)).toStrictEqual({
      dates: [
        {
          date: '3. September 2025',
          weekday: undefined,
          time: 'pois:allDay',
        },
      ],
      hasMoreDates: false,
    })
  })

  it('should format a weekly recurring event with an end date correctly', () => {
    const date = new DateModel({
      startDate: DateTime.fromISO('2025-08-20T09:00:00+02:00', { locale: 'de' }),
      endDate: DateTime.fromISO('2025-08-20T09:30:00+02:00', { locale: 'de' }),
      allDay: false,
      recurrenceRule: rrulestr('DTSTART:20250820T070000\nRRULE:FREQ=WEEKLY;UNTIL=20261101T235959;BYDAY=WE,FR'),
      onlyWeekdays: false,
    })
    expect(formatEventDates(date, t)).toStrictEqual({
      dates: [
        {
          date: '20. August 2025 – 30. Oktober 2026',
          weekday: 'Mittwoch, Freitag',
          time: '09:00–09:30 Uhr',
        },
      ],
      hasMoreDates: false,
    })
  })

  it('should format a weekly recurring event without an end date correctly', () => {
    const date = new DateModel({
      startDate: DateTime.fromISO('2025-08-18T18:00:00+02:00', { locale: 'de' }),
      endDate: DateTime.fromISO('2025-08-18T19:00:00+02:00', { locale: 'de' }),
      allDay: false,
      recurrenceRule: rrulestr('DTSTART:20250818T160000\nRRULE:FREQ=WEEKLY;BYDAY=MO'),
      onlyWeekdays: false,
    })
    expect(formatEventDates(date, t)).toStrictEqual({
      dates: [
        {
          date: 'startingFrom, date: 18. August 2025',
          weekday: 'Montag',
          time: '18:00–19:00 Uhr',
        },
      ],
      hasMoreDates: false,
    })
  })

  it('should format a weekly recurring event without an end date correctly in English', () => {
    const date = new DateModel({
      startDate: DateTime.fromISO('2025-08-18T18:00:00+02:00', { locale: 'en' }),
      endDate: DateTime.fromISO('2025-08-18T19:00:00+02:00', { locale: 'en' }),
      allDay: false,
      recurrenceRule: rrulestr('DTSTART:20250818T160000\nRRULE:FREQ=WEEKLY;BYDAY=MO'),
      onlyWeekdays: false,
    })
    expect(formatEventDates(date, t)).toStrictEqual({
      dates: [
        {
          date: 'startingFrom, date: August 18, 2025',
          weekday: 'Monday',
          time: '6:00 – 7:00 PM',
        },
      ],
      hasMoreDates: false,
    })
  })

  it('should format a monthly recurring event with an end date correctly', () => {
    jest.useFakeTimers().setSystemTime(new Date('2025-08-20T00:00:00+02:00'))
    const date = new DateModel({
      startDate: DateTime.fromISO('2025-08-20T13:00:00+02:00', { locale: 'de' }),
      endDate: DateTime.fromISO('2025-08-20T15:00:00+02:00', { locale: 'de' }),
      allDay: false,
      recurrenceRule: rrulestr('DTSTART:20250820T110000\nRRULE:FREQ=MONTHLY;UNTIL=20251130T235959;BYDAY=+4WE'),
      onlyWeekdays: false,
    })
    expect(formatEventDates(date, t)).toStrictEqual({
      dates: [
        {
          date: 'Mittwoch, 27. August 2025',
          weekday: undefined,
          time: '13:00–15:00 Uhr',
        },
        {
          date: 'Mittwoch, 24. September 2025',
          weekday: undefined,
          time: '13:00–15:00 Uhr',
        },
        {
          date: 'Mittwoch, 22. Oktober 2025',
          weekday: undefined,
          time: '13:00–15:00 Uhr',
        },
        {
          date: 'Mittwoch, 26. November 2025',
          weekday: undefined,
          time: '13:00–15:00 Uhr',
        },
      ],
      hasMoreDates: false,
    })
  })

  it('should format a monthly recurring event without an end date correctly', () => {
    const date = new DateModel({
      startDate: DateTime.fromISO('2025-08-20T13:00:00+02:00', { locale: 'de' }),
      endDate: DateTime.fromISO('2025-08-20T15:00:00+02:00', { locale: 'de' }),
      allDay: false,
      recurrenceRule: rrulestr('DTSTART:20250820T110000\nRRULE:FREQ=MONTHLY;BYDAY=+4WE'),
      onlyWeekdays: false,
    })
    expect(formatEventDates(date, t)).toStrictEqual({
      dates: [
        {
          date: 'Mittwoch, 27. August 2025',
          weekday: undefined,
          time: '13:00–15:00 Uhr',
        },
        {
          date: 'Mittwoch, 24. September 2025',
          weekday: undefined,
          time: '13:00–15:00 Uhr',
        },
        {
          date: 'Mittwoch, 22. Oktober 2025',
          weekday: undefined,
          time: '13:00–15:00 Uhr',
        },
        {
          date: 'Mittwoch, 26. November 2025',
          weekday: undefined,
          time: '13:00–15:00 Uhr',
        },
        {
          date: 'Mittwoch, 24. Dezember 2025',
          weekday: undefined,
          time: '13:00–15:00 Uhr',
        },
      ],
      hasMoreDates: true,
    })
  })

  it('should format a monthly recurring event without an end date correctly in English', () => {
    const date = new DateModel({
      startDate: DateTime.fromISO('2025-08-20T13:00:00+02:00', { locale: 'en' }),
      endDate: DateTime.fromISO('2025-08-20T15:00:00+02:00', { locale: 'en' }),
      allDay: false,
      recurrenceRule: rrulestr('DTSTART:20250820T110000\nRRULE:FREQ=MONTHLY;BYDAY=+4WE'),
      onlyWeekdays: false,
    })
    expect(formatEventDates(date, t)).toStrictEqual({
      dates: [
        {
          date: 'Wednesday, August 27, 2025',
          weekday: undefined,
          time: '1:00 – 3:00 PM',
        },
        {
          date: 'Wednesday, September 24, 2025',
          weekday: undefined,
          time: '1:00 – 3:00 PM',
        },
        {
          date: 'Wednesday, October 22, 2025',
          weekday: undefined,
          time: '1:00 – 3:00 PM',
        },
        {
          date: 'Wednesday, November 26, 2025',
          weekday: undefined,
          time: '1:00 – 3:00 PM',
        },
        {
          date: 'Wednesday, December 24, 2025',
          weekday: undefined,
          time: '1:00 – 3:00 PM',
        },
      ],
      hasMoreDates: true,
    })
  })

  it('should format a yearly recurring event with an end date correctly', () => {
    const date = new DateModel({
      startDate: DateTime.fromISO('2025-08-20T10:00:00+02:00', { locale: 'de' }),
      endDate: DateTime.fromISO('2025-08-20T12:00:00+02:00', { locale: 'de' }),
      allDay: false,
      recurrenceRule: rrulestr(
        'DTSTART:20250820T080000\nRRULE:FREQ=YEARLY;UNTIL=20260831T235959;BYMONTH=8;BYMONTHDAY=20',
      ),
      onlyWeekdays: false,
    })
    expect(formatEventDates(date, t)).toStrictEqual({
      dates: [
        {
          date: 'Mittwoch, 20. August 2025',
          weekday: undefined,
          time: '10:00–12:00 Uhr',
        },
        {
          date: 'Donnerstag, 20. August 2026',
          weekday: undefined,
          time: '10:00–12:00 Uhr',
        },
      ],
      hasMoreDates: false,
    })
  })

  it('should format a yearly recurring event with an end date correctly in English', () => {
    const date = new DateModel({
      startDate: DateTime.fromISO('2025-08-20T10:00:00+02:00', { locale: 'en' }),
      endDate: DateTime.fromISO('2025-08-20T12:00:00+02:00', { locale: 'en' }),
      allDay: false,
      recurrenceRule: rrulestr(
        'DTSTART:20250820T080000\nRRULE:FREQ=YEARLY;UNTIL=20260831T235959;BYMONTH=8;BYMONTHDAY=20',
      ),
      onlyWeekdays: false,
    })
    expect(formatEventDates(date, t)).toStrictEqual({
      dates: [
        {
          date: 'Wednesday, August 20, 2025',
          weekday: undefined,
          time: '10:00 AM – 12:00 PM',
        },
        {
          date: 'Thursday, August 20, 2026',
          weekday: undefined,
          time: '10:00 AM – 12:00 PM',
        },
      ],
      hasMoreDates: false,
    })
  })

  it('should format a yearly recurring event without an end date correctly', () => {
    const date = new DateModel({
      startDate: DateTime.fromISO('2025-08-20T10:00:00+02:00', { locale: 'de' }),
      endDate: DateTime.fromISO('2025-08-20T12:00:00+02:00', { locale: 'de' }),
      allDay: false,
      recurrenceRule: rrulestr('DTSTART:20250820T080000\nRRULE:FREQ=YEARLY;BYMONTH=8;BYMONTHDAY=20'),
      onlyWeekdays: false,
    })
    expect(formatEventDates(date, t)).toStrictEqual({
      dates: [
        {
          date: 'Mittwoch, 20. August 2025',
          weekday: undefined,
          time: '10:00–12:00 Uhr',
        },
        {
          date: 'Donnerstag, 20. August 2026',
          weekday: undefined,
          time: '10:00–12:00 Uhr',
        },
        {
          date: 'Freitag, 20. August 2027',
          weekday: undefined,
          time: '10:00–12:00 Uhr',
        },
        {
          date: 'Sonntag, 20. August 2028',
          weekday: undefined,
          time: '10:00–12:00 Uhr',
        },
        {
          date: 'Montag, 20. August 2029',
          weekday: undefined,
          time: '10:00–12:00 Uhr',
        },
      ],
      hasMoreDates: true,
    })
  })

  it('should format a long-term all-day event correctly', () => {
    const date = new DateModel({
      startDate: DateTime.fromISO('2025-08-18T00:00:00+02:00', { locale: 'de' }),
      endDate: DateTime.fromISO('2025-08-29T23:59:00+02:00', { locale: 'de' }),
      allDay: true,
      recurrenceRule: null,
      onlyWeekdays: false,
    })
    expect(formatEventDates(date, t)).toStrictEqual({
      dates: [
        {
          date: '18.–29. August 2025',
          weekday: undefined,
          time: 'pois:allDay',
        },
      ],
      hasMoreDates: false,
    })
  })

  it('should format a long-term, during-the-week-only event correctly', () => {
    const date = new DateModel({
      startDate: DateTime.fromISO('2025-08-18T10:00:00+02:00', { locale: 'de' }),
      endDate: DateTime.fromISO('2025-08-29T15:00:00+02:00', { locale: 'de' }),
      allDay: false,
      recurrenceRule: null,
      onlyWeekdays: true,
    })
    expect(formatEventDates(date, t)).toStrictEqual({
      dates: [
        {
          date: '18.–29. August 2025',
          weekday: 'Montag – Freitag',
          time: '10:00–15:00 Uhr',
        },
      ],
      hasMoreDates: false,
    })
  })

  it('should format a long-term, during-the-week-only event correctly in English', () => {
    const date = new DateModel({
      startDate: DateTime.fromISO('2025-08-18T10:00:00+02:00', { locale: 'en' }),
      endDate: DateTime.fromISO('2025-08-29T15:00:00+02:00', { locale: 'en' }),
      allDay: false,
      recurrenceRule: null,
      onlyWeekdays: true,
    })
    expect(formatEventDates(date, t)).toStrictEqual({
      dates: [
        {
          date: 'August 18 – 29, 2025',
          weekday: 'Monday – Friday',
          time: '10:00 AM – 3:00 PM',
        },
      ],
      hasMoreDates: false,
    })
  })

  it('should format a long-term event correctly', () => {
    const date = new DateModel({
      startDate: DateTime.fromISO('2025-08-18T11:00:00+02:00', { locale: 'de' }),
      endDate: DateTime.fromISO('2025-09-19T12:00:00+02:00', { locale: 'de' }),
      allDay: false,
      recurrenceRule: null,
      onlyWeekdays: false,
    })
    expect(formatEventDates(date, t)).toStrictEqual({
      dates: [
        {
          date: '18. August – 19. September 2025',
          weekday: undefined,
          time: '11:00–12:00 Uhr',
        },
      ],
      hasMoreDates: false,
    })
  })

  it('should format a long-term event correctly in English', () => {
    const date = new DateModel({
      startDate: DateTime.fromISO('2025-08-18T11:00:00+02:00', { locale: 'en' }),
      endDate: DateTime.fromISO('2025-09-19T12:00:00+02:00', { locale: 'en' }),
      allDay: false,
      recurrenceRule: null,
      onlyWeekdays: false,
    })
    expect(formatEventDates(date, t)).toStrictEqual({
      dates: [
        {
          date: 'August 18 – September 19, 2025',
          weekday: undefined,
          time: '11:00 AM – 12:00 PM',
        },
      ],
      hasMoreDates: false,
    })
  })
})

describe('getWeekdaysFromIndices', () => {
  it('should return the correct weekdays in German', () => {
    expect(getWeekdaysFromIndices([0, 2, 4], 'de')).toBe('Montag, Mittwoch, Freitag')
    expect(getWeekdaysFromIndices([1, 3, 5], 'de')).toBe('Dienstag, Donnerstag, Samstag')
    expect(getWeekdaysFromIndices([6], 'de')).toBe('Sonntag')
  })

  it('should return the correct weekdays in English', () => {
    expect(getWeekdaysFromIndices([0, 2, 4], 'en')).toBe('Monday, Wednesday, Friday')
    expect(getWeekdaysFromIndices([1, 3, 5], 'en')).toBe('Tuesday, Thursday, Saturday')
    expect(getWeekdaysFromIndices([6], 'en')).toBe('Sunday')
  })
})

describe('formatDateInterval', () => {
  it('should format single dates correctly in German', () => {
    const germanDate = DateTime.fromISO('2025-08-20T10:00:00+02:00', { locale: 'de' })
    expect(formatDateInterval(germanDate, null)).toBe('20. August 2025')
  })

  it('should format single dates correctly in English', () => {
    const englishDate = DateTime.fromISO('2025-08-20T10:00:00+02:00', { locale: 'en' })
    expect(formatDateInterval(englishDate, null)).toBe('August 20, 2025')
  })

  it('should format date intervals correctly in German', () => {
    const englishDate = DateTime.fromISO('2025-08-20T10:00:00+02:00', { locale: 'de' })

    const dateSameMonth = DateTime.fromISO('2025-08-21T12:00:00+02:00', { locale: 'de' })
    expect(formatDateInterval(englishDate, dateSameMonth)).toBe('20.–21. August 2025')

    const dateSameYear = DateTime.fromISO('2025-09-19T12:00:00+02:00', { locale: 'de' })
    expect(formatDateInterval(englishDate, dateSameYear)).toBe('20. August – 19. September 2025')

    const dateDifferentYear = DateTime.fromISO('2026-09-19T12:00:00+02:00', { locale: 'de' })
    expect(formatDateInterval(englishDate, dateDifferentYear)).toBe('20. August 2025 – 19. September 2026')
  })

  it('should format date intervals correctly in English', () => {
    const englishDate = DateTime.fromISO('2025-08-20T10:00:00+02:00', { locale: 'en' })

    const dateSameMonth = DateTime.fromISO('2025-08-21T12:00:00+02:00', { locale: 'en' })
    expect(formatDateInterval(englishDate, dateSameMonth)).toBe('August 20 – 21, 2025')

    const dateSameYear = DateTime.fromISO('2025-09-19T12:00:00+02:00', { locale: 'en' })
    expect(formatDateInterval(englishDate, dateSameYear)).toBe('August 20 – September 19, 2025')

    const dateDifferentYear = DateTime.fromISO('2026-09-19T12:00:00+02:00', { locale: 'en' })
    expect(formatDateInterval(englishDate, dateDifferentYear)).toBe('August 20, 2025 – September 19, 2026')
  })
})

describe('formatTime', () => {
  it('should format an interval on the same day correctly in German', () => {
    const date = new DateModel({
      startDate: DateTime.fromISO('2025-08-20T11:00:00+02:00', { locale: 'de' }),
      endDate: DateTime.fromISO('2025-08-20T13:00:00+02:00', { locale: 'de' }),
      allDay: false,
      recurrenceRule: null,
      onlyWeekdays: false,
    })
    expect(formatTime(date, t)).toBe('11:00–13:00 Uhr')
  })

  it('should format an interval on the same day correctly in English', () => {
    const date = new DateModel({
      startDate: DateTime.fromISO('2025-08-20T11:00:00+02:00', { locale: 'en' }),
      endDate: DateTime.fromISO('2025-08-20T13:00:00+02:00', { locale: 'en' }),
      allDay: false,
      recurrenceRule: null,
      onlyWeekdays: false,
    })
    expect(formatTime(date, t)).toBe('11:00 AM – 1:00 PM')
  })

  it('should format a long-term event correctly in German', () => {
    const date = new DateModel({
      startDate: DateTime.fromISO('2025-08-20T11:00:00+02:00', { locale: 'de' }),
      endDate: DateTime.fromISO('2025-09-19T12:00:00+02:00', { locale: 'de' }),
      allDay: false,
      recurrenceRule: null,
      onlyWeekdays: false,
    })
    expect(formatTime(date, t)).toBe('11:00–12:00 Uhr')
  })

  it('should format a long-term event correctly in English', () => {
    const date = new DateModel({
      startDate: DateTime.fromISO('2025-08-20T11:00:00+02:00', { locale: 'en' }),
      endDate: DateTime.fromISO('2025-09-19T12:00:00+02:00', { locale: 'en' }),
      allDay: false,
      recurrenceRule: null,
      onlyWeekdays: false,
    })
    expect(formatTime(date, t)).toBe('11:00 AM – 12:00 PM')
  })

  it('should format an all-day event correctly', () => {
    const date = new DateModel({
      startDate: DateTime.fromISO('2025-08-20T00:00:00+02:00', { locale: 'de' }),
      endDate: DateTime.fromISO('2025-08-20T23:59:00+02:00', { locale: 'de' }),
      allDay: true,
      recurrenceRule: null,
      onlyWeekdays: false,
    })
    expect(formatTime(date, t)).toBe('pois:allDay')
  })
})

describe('translateMondayToFriday', () => {
  it('should return the correct translation in German', () => {
    expect(translateMondayToFriday('de')).toBe('Montag – Freitag')
  })

  it('should return the correct translation in English', () => {
    expect(translateMondayToFriday('en')).toBe('Monday – Friday')
  })
})
