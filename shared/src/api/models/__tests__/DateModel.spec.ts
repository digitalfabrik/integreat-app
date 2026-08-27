import { DateTime } from 'luxon'
import { rrulestr } from 'rrule'

import { mockT } from '../../../testing/index.ts'
import DateModel from '../DateModel.ts'

jest.useFakeTimers({ now: new Date('2023-10-09T15:23:57.443+02:00') })

const toUTCSpans = (dates: DateModel[]) =>
  dates.map(date => ({
    allDay: date.allDay,
    recurrenceRule: date.recurrenceRule ?? null,
    startDate: date.startDate.toUTC().toISO(),
    endDate: date.endDate?.toUTC().toISO(),
    onlyWeekdays: date.onlyWeekdays,
  }))

describe('DateModel', () => {
  beforeEach(() => {
    jest.useFakeTimers({ now: new Date('2023-10-09T15:23:57.443+02:00') })
  })

  describe('isToday', () => {
    it('should return false if event starts after current day', () => {
      const date = new DateModel({
        startDate: DateTime.fromISO('2023-10-03T07:00:00.000+02:00'),
        endDate: DateTime.fromISO('2023-10-04T07:00:00.000+02:00'),
        allDay: false,
        recurrenceRule: null,
        onlyWeekdays: false,
      })

      expect(date.isToday).toBe(false)
    })

    it('should return true if event starts on the current day', () => {
      const date = new DateModel({
        startDate: DateTime.fromISO('2023-10-09T20:00:00.000+02:00'),
        endDate: DateTime.fromISO('2023-10-11T07:00:00.000+02:00'),
        allDay: false,
        recurrenceRule: null,
        onlyWeekdays: false,
      })

      expect(date.isToday).toBe(true)
    })

    it('should return true if event ends on the current day', () => {
      const date = new DateModel({
        startDate: DateTime.fromISO('2023-10-08T07:00:00.000+02:00'),
        endDate: DateTime.fromISO('2023-10-09T18:00:00.000+02:00'),
        allDay: false,
        recurrenceRule: null,
        onlyWeekdays: false,
      })

      expect(date.isToday).toBe(true)
    })

    it('should return true if event started before and ends after the current day', () => {
      const date = new DateModel({
        startDate: DateTime.fromISO('2023-10-08T07:00:00.000+02:00'),
        endDate: DateTime.fromISO('2023-10-11T07:00:00.000+02:00'),
        allDay: false,
        recurrenceRule: null,
        onlyWeekdays: false,
      })

      expect(date.isToday).toBe(true)
    })
  })

  describe('recurrences', () => {
    it('should return itself if there is no rrule set', () => {
      const date = new DateModel({
        startDate: DateTime.fromISO('2017-11-27T19:30:00+02:00'),
        endDate: DateTime.fromISO('2017-11-28T21:30:00+02:00'),
        allDay: false,
        recurrenceRule: null,
        onlyWeekdays: false,
      })

      expect(date.recurrences(1)).toEqual([date])
    })

    it('should return exactly count recurrences', () => {
      const recurrenceRule = rrulestr('DTSTART:20230414T050000\nRRULE:FREQ=WEEKLY;BYDAY=MO')
      const date = new DateModel({
        startDate: DateTime.fromISO('2017-09-27T19:30:00+02:00'),
        endDate: DateTime.fromISO('2017-09-28T21:30:00+02:00'),
        allDay: false,
        recurrenceRule,
        onlyWeekdays: false,
      })

      expect(toUTCSpans(date.recurrences(4))).toHaveLength(4)
    })

    it('should return less recurrences if rrule ends', () => {
      const recurrenceRule = rrulestr('DTSTART:20230414T050000\nRRULE:FREQ=WEEKLY;BYDAY=MO;UNTIL=20231015T050000')
      const date = new DateModel({
        startDate: DateTime.fromISO('2017-09-27T19:30:00+02:00'),
        endDate: DateTime.fromISO('2017-09-28T21:30:00+02:00'),
        allDay: false,
        recurrenceRule,
        onlyWeekdays: false,
      })

      expect(toUTCSpans(date.recurrences(3))).toHaveLength(1)
    })

    it('should correctly offset start and end times also over DST changes', () => {
      const recurrenceRule = rrulestr('DTSTART:20240323T130000\nRRULE:FREQ=WEEKLY;BYDAY=MO;UNTIL=20250109T140000')
      const date = new DateModel({
        startDate: DateTime.fromISO('2024-01-09T14:00:00.000+01:00'),
        endDate: DateTime.fromISO('2024-01-09T16:00:00.000+01:00'),
        allDay: false,
        recurrenceRule,
        onlyWeekdays: false,
      })

      expect(toUTCSpans(date.recurrences(3))).toEqual([
        {
          allDay: false,
          recurrenceRule,
          startDate: '2024-03-25T14:00:00.000Z',
          endDate: '2024-03-25T16:00:00.000Z',
          onlyWeekdays: false,
        },
        {
          allDay: false,
          recurrenceRule,
          startDate: '2024-04-01T14:00:00.000Z',
          endDate: '2024-04-01T16:00:00.000Z',
          onlyWeekdays: false,
        },
        {
          allDay: false,
          recurrenceRule,
          startDate: '2024-04-08T14:00:00.000Z',
          endDate: '2024-04-08T16:00:00.000Z',
          onlyWeekdays: false,
        },
      ])
    })

    it('should correctly keep offset over recurrences', () => {
      jest.useFakeTimers({ now: new Date('2024-05-02T11:45:43.443+02:00') })
      const recurrenceRule = rrulestr('DTSTART:20240116T090000\nRRULE:FREQ=WEEKLY;BYDAY=TU')
      const date = new DateModel({
        startDate: DateTime.fromISO('2024-01-16T10:00:00+01:00'),
        endDate: DateTime.fromISO('2024-01-16T12:00:00+01:00'),
        allDay: false,
        recurrenceRule,
        onlyWeekdays: false,
      })

      const recurrence = date.recurrences(1)[0]!

      expect(recurrence.startDate.toUTC().toISO()).toBe('2024-05-07T10:00:00.000Z')
      expect(recurrence.endDate?.toUTC().toISO()).toBe('2024-05-07T12:00:00.000Z')
      expect(recurrence.formatTimeInterval('de', { t: mockT })).toBe('10:00 - 12:00')
    })

    it('should correctly handle dates if it is winter time and the event starts during winter time', () => {
      jest.useFakeTimers({ now: new Date('2024-01-13T15:23:57.443+01:00') })
      const recurrenceRule = rrulestr('DTSTART:20231223T070000Z\nRRULE:FREQ=WEEKLY;BYDAY=MO')
      const date = new DateModel({
        startDate: DateTime.fromISO('2023-12-25T08:00:00.000+01:00'),
        endDate: DateTime.fromISO('2023-12-25T10:00:00.000+01:00'),
        allDay: false,
        recurrenceRule,
        onlyWeekdays: false,
      })

      expect(toUTCSpans(date.recurrences(1))).toEqual([
        {
          allDay: false,
          recurrenceRule,
          startDate: '2024-01-15T08:00:00.000Z',
          endDate: '2024-01-15T10:00:00.000Z',
          onlyWeekdays: false,
        },
      ])
    })

    it('should correctly handle dates if it is winter time and the event starts during summer time', () => {
      jest.useFakeTimers({ now: new Date('2024-01-13T15:23:57.443+01:00') })
      const recurrenceRule = rrulestr('DTSTART:20230831T120000Z\nRRULE:FREQ=WEEKLY;BYDAY=WE')
      const date = new DateModel({
        startDate: DateTime.fromISO('2023-09-06T14:00:00.000+02:00'),
        endDate: DateTime.fromISO('2023-09-06T15:00:00.000+02:00'),
        allDay: false,
        recurrenceRule,
        onlyWeekdays: false,
      })

      expect(toUTCSpans(date.recurrences(1))).toEqual([
        {
          allDay: false,
          recurrenceRule,
          startDate: '2024-01-17T14:00:00.000Z',
          endDate: '2024-01-17T15:00:00.000Z',
          onlyWeekdays: false,
        },
      ])
    })

    it('should correctly handle dates if it is summer time and the event starts during winter time', () => {
      jest.useFakeTimers({ now: new Date('2024-08-13T15:23:57.443+02:00') })
      const recurrenceRule = rrulestr('DTSTART:20231223T150000Z\nRRULE:FREQ=WEEKLY;BYDAY=TU')
      const date = new DateModel({
        startDate: DateTime.fromISO('2023-12-26T16:00:00.000+01:00'),
        endDate: DateTime.fromISO('2023-12-26T18:00:00.000+01:00'),
        allDay: false,
        recurrenceRule,
        onlyWeekdays: false,
      })

      expect(toUTCSpans(date.recurrences(1))).toEqual([
        {
          allDay: false,
          recurrenceRule,
          startDate: '2024-08-13T16:00:00.000Z',
          endDate: '2024-08-13T18:00:00.000Z',
          onlyWeekdays: false,
        },
      ])
    })

    it('should correctly handle dates if it is summer time and the event starts during summer time', () => {
      jest.useFakeTimers({ now: new Date('2024-08-13T15:23:57.443+02:00') })
      const recurrenceRule = rrulestr('DTSTART:20240331T230000Z\nRRULE:FREQ=WEEKLY;BYDAY=TH')
      const date = new DateModel({
        startDate: DateTime.fromISO('2024-04-01T01:00:00.000+02:00'),
        endDate: DateTime.fromISO('2024-04-01T23:59:00.000+02:00'),
        allDay: false,
        recurrenceRule,
        onlyWeekdays: false,
      })

      expect(toUTCSpans(date.recurrences(1))).toEqual([
        {
          allDay: false,
          recurrenceRule,
          startDate: '2024-08-15T01:00:00.000Z',
          endDate: '2024-08-15T23:59:00.000Z',
          onlyWeekdays: false,
        },
      ])
    })

    it('should correctly handle allDay events in summer time', () => {
      jest.useFakeTimers({ now: new Date('2024-08-13T15:23:57.443+02:00') })
      const recurrenceRule = rrulestr('DTSTART:20240813T220000\nRRULE:FREQ=WEEKLY;BYDAY=SA')
      const date = new DateModel({
        startDate: DateTime.fromISO('2024-08-14T00:00:00.000+02:00'),
        endDate: DateTime.fromISO('2024-08-14T23:59:00.000+02:00'),
        allDay: true,
        recurrenceRule,
        onlyWeekdays: false,
      })

      expect(toUTCSpans(date.recurrences(1))).toEqual([
        {
          allDay: true,
          recurrenceRule,
          startDate: '2024-08-17T00:00:00.000Z',
          endDate: '2024-08-17T23:59:00.000Z',
          onlyWeekdays: false,
        },
      ])
    })

    it('should correctly handle allDay events in winter time', () => {
      jest.useFakeTimers({ now: new Date('2024-01-13T15:23:57.443+01:00') })
      const recurrenceRule = rrulestr('DTSTART:20230813T220000\nRRULE:FREQ=WEEKLY;BYDAY=MO')
      const date = new DateModel({
        startDate: DateTime.fromISO('2023-08-14T00:00:00.000+01:00'),
        endDate: DateTime.fromISO('2023-08-14T23:59:00.000+01:00'),
        allDay: true,
        recurrenceRule,
        onlyWeekdays: false,
      })

      expect(toUTCSpans(date.recurrences(1))).toEqual([
        {
          allDay: true,
          recurrenceRule,
          startDate: '2024-01-15T00:00:00.000Z',
          endDate: '2024-01-15T23:59:00.000Z',
          onlyWeekdays: false,
        },
      ])
    })

    it('should also return events that are happening right now', () => {
      jest.useFakeTimers({ now: new Date('2024-08-15T15:23:57.443+02:00') })
      const recurrenceRule = rrulestr('DTSTART:20240815T120000\nRRULE:FREQ=WEEKLY;BYDAY=TH')
      const date = new DateModel({
        startDate: DateTime.fromISO('2024-08-15T14:00:00.000+02:00'),
        endDate: DateTime.fromISO('2024-08-15T16:00:00.000+02:00'),
        allDay: false,
        recurrenceRule,
        onlyWeekdays: false,
      })

      expect(toUTCSpans(date.recurrences(1))).toEqual([
        {
          allDay: false,
          recurrenceRule,
          startDate: '2024-08-15T14:00:00.000Z',
          endDate: '2024-08-15T16:00:00.000Z',
          onlyWeekdays: false,
        },
      ])
    })

    it('should correctly handle events recurring every second week of the month', () => {
      jest.useFakeTimers({ now: new Date('2024-07-28T15:23:57.443+02:00') })
      const recurrenceRule = rrulestr('DTSTART:20240620T083000\nRRULE:FREQ=MONTHLY;BYDAY=+2MO')
      const date = new DateModel({
        startDate: DateTime.fromISO('2024-06-20T10:30:00.000+02:00'),
        endDate: DateTime.fromISO('2024-06-20T12:00:00.000+02:00'),
        allDay: false,
        recurrenceRule,
        onlyWeekdays: false,
      })

      expect(toUTCSpans(date.recurrences(3))).toEqual([
        {
          allDay: false,
          recurrenceRule,
          startDate: '2024-08-12T10:30:00.000Z',
          endDate: '2024-08-12T12:00:00.000Z',
          onlyWeekdays: false,
        },
        {
          allDay: false,
          recurrenceRule,
          startDate: '2024-09-09T10:30:00.000Z',
          endDate: '2024-09-09T12:00:00.000Z',
          onlyWeekdays: false,
        },
        {
          allDay: false,
          recurrenceRule,
          startDate: '2024-10-14T10:30:00.000Z',
          endDate: '2024-10-14T12:00:00.000Z',
          onlyWeekdays: false,
        },
      ])
    })

    it('should correctly handle events recurring every last week of the month', () => {
      jest.useFakeTimers({ now: new Date('2024-08-28T15:23:57.443+02:00') })
      const recurrenceRule = rrulestr('DTSTART:20240827T220000\nRRULE:FREQ=MONTHLY;BYDAY=-1WE')
      const date = new DateModel({
        startDate: DateTime.fromISO('2024-08-28T00:00:00.000+02:00'),
        endDate: DateTime.fromISO('2024-08-28T23:59:00.000+02:00'),
        allDay: true,
        recurrenceRule,
        onlyWeekdays: false,
      })

      expect(toUTCSpans(date.recurrences(3))).toEqual([
        {
          allDay: true,
          recurrenceRule,
          startDate: '2024-08-28T00:00:00.000Z',
          endDate: '2024-08-28T23:59:00.000Z',
          onlyWeekdays: false,
        },
        {
          allDay: true,
          recurrenceRule,
          startDate: '2024-09-25T00:00:00.000Z',
          endDate: '2024-09-25T23:59:00.000Z',
          onlyWeekdays: false,
        },
        {
          allDay: true,
          recurrenceRule,
          startDate: '2024-10-30T00:00:00.000Z',
          endDate: '2024-10-30T23:59:00.000Z',
          onlyWeekdays: false,
        },
      ])
    })

    it('should correctly handle events recurring every third week of every second month', () => {
      jest.useFakeTimers({ now: new Date('2024-08-28T15:23:57.443+02:00') })
      const recurrenceRule = rrulestr('DTSTART:20240620T083000\nRRULE:FREQ=MONTHLY;INTERVAL=2;BYDAY=+3TH')
      const date = new DateModel({
        startDate: DateTime.fromISO('2024-06-20T10:30:00.000+02:00'),
        endDate: DateTime.fromISO('2024-06-20T12:00:00.000+02:00'),
        allDay: false,
        recurrenceRule,
        onlyWeekdays: false,
      })

      expect(toUTCSpans(date.recurrences(3))).toEqual([
        {
          allDay: false,
          recurrenceRule,
          startDate: '2024-10-17T10:30:00.000Z',
          endDate: '2024-10-17T12:00:00.000Z',
          onlyWeekdays: false,
        },
        {
          allDay: false,
          recurrenceRule,
          startDate: '2024-12-19T10:30:00.000Z',
          endDate: '2024-12-19T12:00:00.000Z',
          onlyWeekdays: false,
        },
        {
          allDay: false,
          recurrenceRule,
          startDate: '2025-02-20T10:30:00.000Z',
          endDate: '2025-02-20T12:00:00.000Z',
          onlyWeekdays: false,
        },
      ])
    })

    it('should correctly handle events repeating annually', () => {
      jest.useFakeTimers({ now: new Date('2024-08-28T15:23:57.443+02:00') })
      const recurrenceRule = rrulestr('DTSTART:20241205T230000\nRRULE:FREQ=YEARLY')
      const date = new DateModel({
        startDate: DateTime.fromISO('2024-12-06T00:00:00.000+01:00'),
        endDate: DateTime.fromISO('2024-12-06T23:59:00.000+01:00'),
        allDay: true,
        recurrenceRule,
        onlyWeekdays: false,
      })

      expect(toUTCSpans(date.recurrences(3))).toEqual([
        {
          allDay: true,
          startDate: '2024-12-06T00:00:00.000Z',
          endDate: '2024-12-06T23:59:00.000Z',
          recurrenceRule,
          onlyWeekdays: false,
        },
        {
          allDay: true,
          startDate: '2025-12-06T00:00:00.000Z',
          endDate: '2025-12-06T23:59:00.000Z',
          recurrenceRule,
          onlyWeekdays: false,
        },
        {
          allDay: true,
          startDate: '2026-12-06T00:00:00.000Z',
          endDate: '2026-12-06T23:59:00.000Z',
          recurrenceRule,
          onlyWeekdays: false,
        },
      ])
    })

    it('should correctly handle events repeating every 2 years', () => {
      jest.useFakeTimers({ now: new Date('2024-08-28T15:23:57.443+02:00') })
      const recurrenceRule = rrulestr('DTSTART:20241205T230000\nRRULE:FREQ=YEARLY;INTERVAL=2')
      const date = new DateModel({
        startDate: DateTime.fromISO('2024-12-06T00:00:00.000+01:00'),
        endDate: DateTime.fromISO('2024-12-06T23:59:00.000+01:00'),
        allDay: true,
        recurrenceRule,
        onlyWeekdays: false,
      })

      expect(toUTCSpans(date.recurrences(3))).toEqual([
        {
          allDay: true,
          startDate: '2024-12-06T00:00:00.000Z',
          endDate: '2024-12-06T23:59:00.000Z',
          recurrenceRule,
          onlyWeekdays: false,
        },
        {
          allDay: true,
          startDate: '2026-12-06T00:00:00.000Z',
          endDate: '2026-12-06T23:59:00.000Z',
          recurrenceRule,
          onlyWeekdays: false,
        },
        {
          allDay: true,
          startDate: '2028-12-06T00:00:00.000Z',
          endDate: '2028-12-06T23:59:00.000Z',
          recurrenceRule,
          onlyWeekdays: false,
        },
      ])
    })

    it('should not jump for spring transition for timed and all-day events', () => {
      const recurrenceRule = rrulestr('DTSTART:20250323T130000\nRRULE:FREQ=WEEKLY;BYDAY=SU')
      const timedEvent = new DateModel({
        startDate: DateTime.fromISO('2025-03-23T14:00:00+01:00'),
        endDate: DateTime.fromISO('2025-03-23T16:00:00+01:00'),
        allDay: false,
        recurrenceRule,
        onlyWeekdays: false,
      })

      const allDayRecurrence = rrulestr('DTSTART:20250322T230000\nRRULE:FREQ=WEEKLY;BYDAY=SU')
      const allDay = new DateModel({
        startDate: DateTime.fromISO('2025-03-23T00:00:00+01:00'),
        endDate: DateTime.fromISO('2025-03-23T23:59:00+01:00'),
        allDay: true,
        recurrenceRule: allDayRecurrence,
        onlyWeekdays: false,
      })

      expect(toUTCSpans(timedEvent.recurrences(3))).toEqual([
        {
          allDay: false,
          recurrenceRule,
          startDate: '2025-03-23T14:00:00.000Z',
          endDate: '2025-03-23T16:00:00.000Z',
          onlyWeekdays: false,
        },
        {
          allDay: false,
          recurrenceRule,
          startDate: '2025-03-30T14:00:00.000Z',
          endDate: '2025-03-30T16:00:00.000Z',
          onlyWeekdays: false,
        },
        {
          allDay: false,
          recurrenceRule,
          startDate: '2025-04-06T14:00:00.000Z',
          endDate: '2025-04-06T16:00:00.000Z',
          onlyWeekdays: false,
        },
      ])

      expect(toUTCSpans(allDay.recurrences(3))).toEqual([
        {
          allDay: true,
          recurrenceRule: allDayRecurrence,
          startDate: '2025-03-23T00:00:00.000Z',
          endDate: '2025-03-23T23:59:00.000Z',
          onlyWeekdays: false,
        },
        {
          allDay: true,
          recurrenceRule: allDayRecurrence,
          startDate: '2025-03-30T00:00:00.000Z',
          endDate: '2025-03-30T23:59:00.000Z',
          onlyWeekdays: false,
        },
        {
          allDay: true,
          recurrenceRule: allDayRecurrence,
          startDate: '2025-04-06T00:00:00.000Z',
          endDate: '2025-04-06T23:59:00.000Z',
          onlyWeekdays: false,
        },
      ])
    })

    it('should not jump for winter transition for timed and all-day events', () => {
      const recurrenceRule = rrulestr('DTSTART:20251013T120000\nRRULE:FREQ=WEEKLY;BYDAY=SU')
      const timedEvent = new DateModel({
        startDate: DateTime.fromISO('2025-10-13T14:00:00+02:00'),
        endDate: DateTime.fromISO('2025-10-13T16:00:00+02:00'),
        allDay: false,
        recurrenceRule,
        onlyWeekdays: false,
      })

      const allDayRecurrence = rrulestr('DTSTART:20251013T220000\nRRULE:FREQ=WEEKLY;BYDAY=SU')
      const allDay = new DateModel({
        startDate: DateTime.fromISO('2025-10-13T00:00:00+02:00'),
        endDate: DateTime.fromISO('2025-10-13T23:59:00+02:00'),
        allDay: true,
        recurrenceRule: allDayRecurrence,
        onlyWeekdays: false,
      })

      expect(toUTCSpans(timedEvent.recurrences(3))).toEqual([
        {
          allDay: false,
          recurrenceRule,
          startDate: '2025-10-19T14:00:00.000Z',
          endDate: '2025-10-19T16:00:00.000Z',
          onlyWeekdays: false,
        },
        {
          allDay: false,
          recurrenceRule,
          startDate: '2025-10-26T14:00:00.000Z',
          endDate: '2025-10-26T16:00:00.000Z',
          onlyWeekdays: false,
        },
        {
          allDay: false,
          recurrenceRule,
          startDate: '2025-11-02T14:00:00.000Z',
          endDate: '2025-11-02T16:00:00.000Z',
          onlyWeekdays: false,
        },
      ])

      expect(toUTCSpans(allDay.recurrences(3))).toEqual([
        {
          allDay: true,
          recurrenceRule: allDayRecurrence,
          startDate: '2025-10-19T00:00:00.000Z',
          endDate: '2025-10-19T23:59:00.000Z',
          onlyWeekdays: false,
        },
        {
          allDay: true,
          recurrenceRule: allDayRecurrence,
          startDate: '2025-10-26T00:00:00.000Z',
          endDate: '2025-10-26T23:59:00.000Z',
          onlyWeekdays: false,
        },
        {
          allDay: true,
          recurrenceRule: allDayRecurrence,
          startDate: '2025-11-02T00:00:00.000Z',
          endDate: '2025-11-02T23:59:00.000Z',
          onlyWeekdays: false,
        },
      ])
    })

    it('should return recurrences within the filter date range', () => {
      jest.useFakeTimers({ now: new Date('2024-01-01T00:00:00.000+01:00') })
      const recurrenceRule = rrulestr('DTSTART:20240101T090000\nRRULE:FREQ=DAILY;COUNT=10')
      const date = new DateModel({
        startDate: DateTime.fromISO('2024-01-01T10:00:00+01:00'),
        endDate: DateTime.fromISO('2024-01-01T11:00:00+01:00'),
        allDay: false,
        recurrenceRule,
        onlyWeekdays: false,
      })
      const filterStartDate = DateTime.fromISO('2024-01-03T00:00:00+01:00')
      const filterEndDate = DateTime.fromISO('2024-01-05T23:59:59+01:00')

      const recurrences = date.recurrences(3, filterStartDate, filterEndDate)
      expect(toUTCSpans(recurrences)).toEqual([
        {
          allDay: false,
          startDate: '2024-01-03T10:00:00.000Z',
          endDate: '2024-01-03T11:00:00.000Z',
          recurrenceRule,
          onlyWeekdays: false,
        },
        {
          allDay: false,
          startDate: '2024-01-04T10:00:00.000Z',
          endDate: '2024-01-04T11:00:00.000Z',
          recurrenceRule,
          onlyWeekdays: false,
        },
        {
          allDay: false,
          startDate: '2024-01-05T10:00:00.000Z',
          endDate: '2024-01-05T11:00:00.000Z',
          recurrenceRule,
          onlyWeekdays: false,
        },
      ])
    })

    it('should return recurrences starting from filterStartDate', () => {
      jest.useFakeTimers({ now: new Date('2024-01-01T00:00:00.000+01:00') })
      const recurrenceRule = rrulestr('DTSTART:20240101T090000\nRRULE:FREQ=DAILY;COUNT=10')
      const date = new DateModel({
        startDate: DateTime.fromISO('2024-01-01T10:00:00+01:00'),
        endDate: DateTime.fromISO('2024-01-01T11:00:00+01:00'),
        allDay: false,
        recurrenceRule,
        onlyWeekdays: false,
      })
      const filterStartDate = DateTime.fromISO('2024-01-05T00:00:00+01:00')

      const recurrences = date.recurrences(3, filterStartDate, null)
      expect(toUTCSpans(recurrences)).toEqual([
        {
          startDate: '2024-01-05T10:00:00.000Z',
          endDate: '2024-01-05T11:00:00.000Z',
          allDay: false,
          recurrenceRule,
          onlyWeekdays: false,
        },
        {
          startDate: '2024-01-06T10:00:00.000Z',
          endDate: '2024-01-06T11:00:00.000Z',
          allDay: false,
          recurrenceRule,
          onlyWeekdays: false,
        },
        {
          startDate: '2024-01-07T10:00:00.000Z',
          endDate: '2024-01-07T11:00:00.000Z',
          allDay: false,
          recurrenceRule,
          onlyWeekdays: false,
        },
      ])
    })

    it('should not include a late-evening recurrence from the previous day when filtering by the next day', () => {
      jest.useFakeTimers({ now: new Date('2024-08-25T12:00:00.000+02:00') })
      const recurrenceRule = rrulestr('DTSTART:20240820T200000\nRRULE:FREQ=DAILY;COUNT=20')
      const date = new DateModel({
        startDate: DateTime.fromISO('2024-08-20T22:00:00.000+02:00'),
        endDate: DateTime.fromISO('2024-08-20T23:00:00.000+02:00'),
        allDay: false,
        recurrenceRule,
        onlyWeekdays: false,
      })
      const filterStartDate = DateTime.fromISO('2024-08-28T00:00:00+02:00').startOf('day')
      const filterEndDate = DateTime.fromISO('2024-08-28T00:00:00+02:00').endOf('day')

      expect(toUTCSpans(date.recurrences(3, filterStartDate, filterEndDate))).toEqual([
        {
          allDay: false,
          startDate: '2024-08-28T22:00:00.000Z',
          endDate: '2024-08-28T23:00:00.000Z',
          recurrenceRule,
          onlyWeekdays: false,
        },
      ])
    })

    it('should return recurrences up to filterEndDate', () => {
      jest.useFakeTimers({ now: new Date('2024-01-01T00:00:00.000+01:00') })
      const recurrenceRule = rrulestr('DTSTART:20240101T090000\nRRULE:FREQ=DAILY;COUNT=10')
      const date = new DateModel({
        startDate: DateTime.fromISO('2024-01-01T10:00:00+01:00'),
        endDate: DateTime.fromISO('2024-01-01T11:00:00+01:00'),
        allDay: false,
        recurrenceRule,
        onlyWeekdays: false,
      })
      const filterEndDate = DateTime.fromISO('2024-01-02T23:59:59+01:00')

      const recurrences = date.recurrences(2, null, filterEndDate)
      expect(toUTCSpans(recurrences)).toEqual([
        {
          startDate: '2024-01-01T10:00:00.000Z',
          endDate: '2024-01-01T11:00:00.000Z',
          allDay: false,
          recurrenceRule,
          onlyWeekdays: false,
        },
        {
          startDate: '2024-01-02T10:00:00.000Z',
          endDate: '2024-01-02T11:00:00.000Z',
          allDay: false,
          recurrenceRule,
          onlyWeekdays: false,
        },
      ])
    })
  })

  describe('formatDateInterval', () => {
    it('should format a future single-day event with the year', () => {
      const date = new DateModel({
        startDate: DateTime.fromISO('2025-08-20T11:00:00+02:00'),
        endDate: DateTime.fromISO('2025-08-20T13:00:00+02:00'),
        allDay: false,
        recurrenceRule: null,
        onlyWeekdays: false,
      })
      expect(date.formatDateInterval('de')).toBe('20. Aug. 2025')
    })

    it('should format a future single-day event with the year in English', () => {
      const date = new DateModel({
        startDate: DateTime.fromISO('2025-08-20T11:00:00+02:00'),
        endDate: DateTime.fromISO('2025-08-20T13:00:00+02:00'),
        allDay: false,
        recurrenceRule: null,
        onlyWeekdays: false,
      })
      expect(date.formatDateInterval('en')).toBe('Aug 20, 2025')
    })

    it('should format a future multi-day event as an interval with year', () => {
      const date = new DateModel({
        startDate: DateTime.fromISO('2025-08-18T11:00:00+02:00'),
        endDate: DateTime.fromISO('2025-09-19T12:00:00+02:00'),
        allDay: false,
        recurrenceRule: null,
        onlyWeekdays: false,
      })
      expect(date.formatDateInterval('de')).toBe('18. Aug. 2025 - 19. Sept. 2025')
    })

    it('should format a single day when start and end fall on the same day', () => {
      const date = new DateModel({
        startDate: DateTime.fromISO('2025-09-03T00:00:00+02:00'),
        endDate: DateTime.fromISO('2025-09-03T23:59:00+02:00'),
        allDay: true,
        recurrenceRule: null,
        onlyWeekdays: false,
      })
      expect(date.formatDateInterval('de')).toBe('3. Sept. 2025')
    })

    it('should format an event without an end date as a single day', () => {
      const date = new DateModel({
        startDate: DateTime.fromISO('2025-08-20T11:00:00+02:00'),
        endDate: null,
        allDay: false,
        recurrenceRule: null,
        onlyWeekdays: false,
      })
      expect(date.formatDateInterval('de')).toBe('20. Aug. 2025')
    })

    it('should omit the year for a current-year single-day event without an end date', () => {
      const date = new DateModel({
        startDate: DateTime.fromISO('2023-10-15T08:00:00+02:00'),
        endDate: null,
        allDay: false,
        recurrenceRule: null,
        onlyWeekdays: false,
      })
      expect(date.formatDateInterval('de')).toBe('15. Okt.')
    })
  })

  describe('formatTimeInterval', () => {
    it('should format a time interval with start and end times', () => {
      const date = new DateModel({
        startDate: DateTime.fromISO('2025-08-20T11:00:00+02:00'),
        endDate: DateTime.fromISO('2025-08-20T13:00:00+02:00'),
        allDay: false,
        recurrenceRule: null,
        onlyWeekdays: false,
      })
      expect(date.formatTimeInterval('de', { t: mockT })).toBe('11:00 - 13:00')
    })

    it('should format a time interval in English', () => {
      const date = new DateModel({
        startDate: DateTime.fromISO('2025-08-20T11:00:00+02:00'),
        endDate: DateTime.fromISO('2025-08-20T13:00:00+02:00'),
        allDay: false,
        recurrenceRule: null,
        onlyWeekdays: false,
      })
      expect(date.formatTimeInterval('en', { t: mockT })).toBe('11:00 AM - 1:00 PM')
    })

    it('should return only the start time when end and start match to the minute', () => {
      const date = new DateModel({
        startDate: DateTime.fromISO('2025-08-20T11:00:00+02:00'),
        endDate: DateTime.fromISO('2025-08-20T11:00:00+02:00'),
        allDay: false,
        recurrenceRule: null,
        onlyWeekdays: false,
      })
      expect(date.formatTimeInterval('de', { t: mockT })).toBe('11:00')
    })

    it('should return only the start time when there is no end date', () => {
      const date = new DateModel({
        startDate: DateTime.fromISO('2025-08-20T11:00:00+02:00'),
        endDate: null,
        allDay: false,
        recurrenceRule: null,
        onlyWeekdays: false,
      })
      expect(date.formatTimeInterval('de', { t: mockT })).toBe('11:00')
    })

    it('should return the all-day label for an all-day event', () => {
      const date = new DateModel({
        startDate: DateTime.fromISO('2025-08-20T00:00:00+02:00'),
        endDate: DateTime.fromISO('2025-08-20T23:59:00+02:00'),
        allDay: true,
        recurrenceRule: null,
        onlyWeekdays: false,
      })
      expect(date.formatTimeInterval('de', { t: mockT })).toBe('places:allDay')
    })
  })
})
