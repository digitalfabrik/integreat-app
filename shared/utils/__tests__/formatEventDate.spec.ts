import { DateTime } from 'luxon'
import { rrulestr } from 'rrule'

import { DateModel } from '../../api'
import formatEventDate from '../formatEventDate'

// {startDate: DateTime.fromISO('2023-10-09T07:00:00.000+02:00'),
//       endDate: DateTime.fromISO('2023-10-10T09:00:00.000+02:00'),
//       allDay: false,
//       recurrenceRule: rrule ? rrulestr(rrule) : null,}
describe('formatEventDate', () => {
  it('should format a one-time, not all-day event correctly', () => {
    const date = new DateModel({
      startDate: DateTime.fromISO('2025-08-29T11:00:00+02:00'),
      endDate: DateTime.fromISO('2025-08-29T13:00:00+02:00'),
      allDay: false,
      recurrenceRule: null,
      onlyWeekdays: false,
    })
    expect(formatEventDate(date)).toStrictEqual([
      {
        date: '29. August 2025',
        weekday: undefined,
        time: '11:00 - 13:00 Uhr',
      },
    ])
  })

  it('should format a one-time, all-day event correctly', () => {
    const date = new DateModel({
      startDate: DateTime.fromISO('2025-09-03T00:00:00+02:00'),
      endDate: DateTime.fromISO('2025-09-03T23:59:00+02:00'),
      allDay: true,
      recurrenceRule: null,
      onlyWeekdays: false,
    })
    expect(formatEventDate(date)).toStrictEqual([
      {
        date: '3. September 2025',
        weekday: undefined,
        time: 'ganztägig', // TODO: Use a translation
      },
    ])
  })

  it('should format a weekly recurring event with an end date correctly', () => {
    const date = new DateModel({
      startDate: DateTime.fromISO('2025-08-20T09:00:00+02:00'),
      endDate: DateTime.fromISO('2025-08-20T09:30:00+02:00'),
      allDay: false,
      recurrenceRule: rrulestr('DTSTART:20250820T070000\nRRULE:FREQ=WEEKLY;UNTIL=20261031T235959;BYDAY=WE,FR'),
      onlyWeekdays: false,
    })
    expect(formatEventDate(date)).toStrictEqual([
      {
        date: '20. August 2025 - 31. Oktober 2026',
        weekday: 'Mittwoch, Freitag',
        time: '09:00 - 09:30 Uhr',
      },
    ])
  })

  it('should format a weekly recurring event without an end date correctly', () => {
    const date = new DateModel({
      startDate: DateTime.fromISO('2025-08-18T18:00:00+02:00'),
      endDate: DateTime.fromISO('2025-08-18T19:00:00+02:00'),
      allDay: false,
      recurrenceRule: rrulestr('DTSTART:20250818T160000\nRRULE:FREQ=WEEKLY;BYDAY=MO'),
      onlyWeekdays: false,
    })
    expect(formatEventDate(date)).toStrictEqual([
      {
        date: 'ab 18. August 2025',
        weekday: 'Montag',
        time: '18:00 - 19:00 Uhr',
      },
    ])
  })

  it('should format a monthly recurring event with an end date correctly', () => {
    const date = new DateModel({
      startDate: DateTime.fromISO('2025-08-20T13:00:00+02:00'),
      endDate: DateTime.fromISO('2025-08-20T15:00:00+02:00'),
      allDay: false,
      recurrenceRule: rrulestr('DTSTART:20250820T110000\nRRULE:FREQ=MONTHLY;UNTIL=20251130T235959;BYDAY=+4WE'),
      onlyWeekdays: false,
    })
    expect(formatEventDate(date)).toStrictEqual([
      {
        date: 'Mittwoch, 27. August 2025',
        weekday: undefined,
        time: '13:00 - 15:00 Uhr',
      },
      {
        date: 'Mittwoch, 24. September 2025',
        weekday: undefined,
        time: '13:00 - 15:00 Uhr',
      },
      {
        date: 'Mittwoch, 22. Oktober 2025',
        weekday: undefined,
        time: '13:00 - 15:00 Uhr',
      },
      {
        date: 'Mittwoch, 26. November 2025',
        weekday: undefined,
        time: '13:00 - 15:00 Uhr',
      },
    ])
  })

  it('should format a monthly recurring event without an end date correctly', () => {
    const date = new DateModel({
      startDate: DateTime.fromISO('2025-08-20T13:00:00+02:00'),
      endDate: DateTime.fromISO('2025-08-20T15:00:00+02:00'),
      allDay: false,
      recurrenceRule: rrulestr('DTSTART:20250820T110000\nRRULE:FREQ=MONTHLY;BYDAY=+4WE'),
      onlyWeekdays: false,
    })
    expect(formatEventDate(date)).toStrictEqual([
      {
        date: 'Mittwoch, 27. August 2025',
        weekday: undefined,
        time: '13:00 - 15:00 Uhr',
      },
      {
        date: 'Mittwoch, 24. September 2025',
        weekday: undefined,
        time: '13:00 - 15:00 Uhr',
      },
      {
        date: 'Mittwoch, 22. Oktober 2025',
        weekday: undefined,
        time: '13:00 - 15:00 Uhr',
      },
      {
        date: 'Mittwoch, 26. November 2025',
        weekday: undefined,
        time: '13:00 - 15:00 Uhr',
      },
      {
        date: 'Mittwoch, 24. Dezember 2025',
        weekday: undefined,
        time: '13:00 - 15:00 Uhr',
      },
    ])
  })

  it('should format a yearly recurring event with an end date correctly', () => {
    const date = new DateModel({
      startDate: DateTime.fromISO('2025-08-20T10:00:00+02:00'),
      endDate: DateTime.fromISO('2025-08-20T12:00:00+02:00'),
      allDay: false,
      recurrenceRule: rrulestr(
        'DTSTART:20250820T080000\nRRULE:FREQ=YEARLY;UNTIL=20260831T235959;BYMONTH=8;BYMONTHDAY=20',
      ),
      onlyWeekdays: false,
    })
    expect(formatEventDate(date)).toStrictEqual([
      {
        date: 'Mittwoch, 20. August 2025',
        weekday: undefined,
        time: '10:00 - 12:00 Uhr',
      },
      {
        date: 'Donnerstag, 20. August 2026',
        weekday: undefined,
        time: '10:00 - 12:00 Uhr',
      },
    ])
  })

  it('should format a yearly recurring event without an end date correctly', () => {
    const date = new DateModel({
      startDate: DateTime.fromISO('2025-08-20T10:00:00+02:00'),
      endDate: DateTime.fromISO('2025-08-20T12:00:00+02:00'),
      allDay: false,
      recurrenceRule: rrulestr('DTSTART:20250820T080000\nRRULE:FREQ=YEARLY;BYMONTH=8;BYMONTHDAY=20'),
      onlyWeekdays: false,
    })
    expect(formatEventDate(date)).toStrictEqual([
      {
        date: 'Mittwoch, 20. August 2025',
        weekday: undefined,
        time: '10:00 - 12:00 Uhr',
      },
      {
        date: 'Donnerstag, 20. August 2026',
        weekday: undefined,
        time: '10:00 - 12:00 Uhr',
      },
      {
        date: 'Freitag, 20. August 2027',
        weekday: undefined,
        time: '10:00 - 12:00 Uhr',
      },
      {
        date: 'Sonntag, 20. August 2028',
        weekday: undefined,
        time: '10:00 - 12:00 Uhr',
      },
      {
        date: 'Montag, 20. August 2029',
        weekday: undefined,
        time: '10:00 - 12:00 Uhr',
      },
    ])
  })

  it('should format a long-term all-day event correctly', () => {
    const date = new DateModel({
      startDate: DateTime.fromISO('2025-08-18T00:00:00+02:00'),
      endDate: DateTime.fromISO('2025-08-29T23:59:00+02:00'),
      allDay: true,
      recurrenceRule: null,
      onlyWeekdays: false,
    })
    expect(formatEventDate(date)).toStrictEqual({
      date: '18. August 2025 - 29. August 2025',
      weekday: undefined,
      time: 'ganztägig', // TODO: Use a translation
    })
  })

  // TODO: How is that information sent to us?
  it('should format a long-term, during-the-week-only event correctly', () => {
    const date = new DateModel({
      startDate: DateTime.fromISO('2025-08-18T10:00:00+02:00'),
      endDate: DateTime.fromISO('2025-08-29T15:00:00+02:00'),
      allDay: false,
      recurrenceRule: null,
      onlyWeekdays: true,
    })
    expect(formatEventDate(date)).toStrictEqual([
      {
        date: '18. August 2025 - 29. August 2025',
        weekday: undefined,
        time: '10:00 - 15:00 Uhr',
      },
    ])
  })
})
