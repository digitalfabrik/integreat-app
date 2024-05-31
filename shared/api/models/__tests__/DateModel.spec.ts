import { DateTime } from 'luxon'
import { rrulestr } from 'rrule'

import DateModel from '../DateModel'

jest.useFakeTimers({ now: new Date('2023-10-09T15:23:57.443+02:00') })
describe('DateModel', () => {
  const locales = ['de', 'en', 'fr', 'ar', 'fa', 'ru']

  const normalizeWhitespaces = (str: string) => str.replace(/\s+/g, ' ')

  describe('toTimeSpanString()', () => {
    it('should return start date + time and end date + time', () => {
      const startDate = DateTime.fromISO('2017-11-27T19:30:00+01:00')
      const endDate = DateTime.fromISO('2017-11-28T21:30:00+01:00')
      const allDay = false
      const date = new DateModel({
        startDate,
        endDate,
        allDay,
        recurrenceRule: null,
      })
      expect(
        locales.map(locale => `${locale}: ${normalizeWhitespaces(date.toFormattedString(locale))}`),
      ).toMatchSnapshot()
    })

    it('should return only start date + time and end time if the dates are the same', () => {
      const startDate = DateTime.fromISO('2017-11-27T19:30:00+01:00')
      const endDate = DateTime.fromISO('2017-11-27T21:30:00+01:00')
      const allDay = false
      const date = new DateModel({
        startDate,
        endDate,
        allDay,
        recurrenceRule: null,
      })
      expect(
        locales.map(locale => `${locale}: ${normalizeWhitespaces(date.toFormattedString(locale))}`),
      ).toMatchSnapshot()
    })

    it('should return only start date + time if start and end are the same', () => {
      const startDate = DateTime.fromISO('2017-11-27T19:30:00+01:00')
      const endDate = DateTime.fromISO('2017-11-27T19:30:00+01:00')
      const allDay = false
      const date = new DateModel({
        startDate,
        endDate,
        allDay,
        recurrenceRule: null,
      })
      expect(
        locales.map(locale => `${locale}: ${normalizeWhitespaces(date.toFormattedString(locale))}`),
      ).toMatchSnapshot()
    })

    it('should return only start date + end date if allDay is true', () => {
      const startDate = DateTime.fromISO('2017-11-27T19:30:00+01:00')
      const endDate = DateTime.fromISO('2017-11-28T21:30:00+01:00')
      const allDay = true
      const date = new DateModel({
        startDate,
        endDate,
        allDay,
        recurrenceRule: null,
      })
      expect(
        locales.map(locale => `${locale}: ${normalizeWhitespaces(date.toFormattedString(locale))}`),
      ).toMatchSnapshot()
    })

    it('should return only start date if allDay is true and the dates are the same', () => {
      const startDate = DateTime.fromISO('2017-11-27T19:30:00+01:00')
      const endDate = DateTime.fromISO('2017-11-27T21:30:00+01:00')
      const allDay = true
      const date = new DateModel({
        startDate,
        endDate,
        allDay,
        recurrenceRule: null,
      })
      expect(
        locales.map(locale => `${locale}: ${normalizeWhitespaces(date.toFormattedString(locale))}`),
      ).toMatchSnapshot()
    })
  })

  describe('isToday', () => {
    it('should return false if event starts after current day', () => {
      const date = new DateModel({
        startDate: DateTime.fromISO('2023-10-03T07:00:00.000+02:00'),
        endDate: DateTime.fromISO('2023-10-04T07:00:00.000+02:00'),
        allDay: false,
        recurrenceRule: null,
      })

      expect(date.isToday).toBe(false)
    })

    it('should return true if event starts on the current day', () => {
      const date = new DateModel({
        startDate: DateTime.fromISO('2023-10-09T20:00:00.000+02:00'),
        endDate: DateTime.fromISO('2023-10-11T07:00:00.000+02:00'),
        allDay: false,
        recurrenceRule: null,
      })

      expect(date.isToday).toBe(true)
    })

    it('should return true if event ends on the current day', () => {
      const date = new DateModel({
        startDate: DateTime.fromISO('2023-10-08T07:00:00.000+02:00'),
        endDate: DateTime.fromISO('2023-10-09T18:00:00.000+02:00'),
        allDay: false,
        recurrenceRule: null,
      })

      expect(date.isToday).toBe(true)
    })

    it('should return true if event started before and ends after the current day', () => {
      const date = new DateModel({
        startDate: DateTime.fromISO('2023-10-08T07:00:00.000+02:00'),
        endDate: DateTime.fromISO('2023-10-11T07:00:00.000+02:00'),
        allDay: false,
        recurrenceRule: null,
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
      })

      expect(date.recurrences(4)).toEqual([
        new DateModel({
          allDay: false,
          recurrenceRule,
          startDate: DateTime.fromISO('2023-10-09T07:00:00.000+02:00'),
          endDate: DateTime.fromISO('2023-10-10T09:00:00.000+02:00'),
          offset: 120,
        }),
        new DateModel({
          allDay: false,
          recurrenceRule,
          startDate: DateTime.fromISO('2023-10-16T07:00:00.000+02:00'),
          endDate: DateTime.fromISO('2023-10-17T09:00:00.000+02:00'),
          offset: 120,
        }),
        new DateModel({
          allDay: false,
          recurrenceRule,
          startDate: DateTime.fromISO('2023-10-23T07:00:00.000+02:00'),
          endDate: DateTime.fromISO('2023-10-24T09:00:00.000+02:00'),
          offset: 120,
        }),
        new DateModel({
          allDay: false,
          recurrenceRule,
          startDate: DateTime.fromISO('2023-10-30T07:00:00.000+01:00'),
          endDate: DateTime.fromISO('2023-10-31T09:00:00.000+01:00'),
          offset: 120,
        }),
      ])
    })

    it('should return less recurrences if rrule ends', () => {
      const recurrenceRule = rrulestr('DTSTART:20230414T050000\nRRULE:FREQ=WEEKLY;BYDAY=MO;UNTIL=20231015T050000')
      const date = new DateModel({
        startDate: DateTime.fromISO('2017-09-27T19:30:00+02:00'),
        endDate: DateTime.fromISO('2017-09-28T21:30:00+02:00'),
        allDay: false,
        recurrenceRule,
      })

      expect(date.recurrences(3)).toEqual([
        new DateModel({
          allDay: false,
          recurrenceRule,
          startDate: DateTime.fromISO('2023-10-09T07:00:00.000+02:00'),
          endDate: DateTime.fromISO('2023-10-10T09:00:00.000+02:00'),
        }),
      ])
    })

    it('should correctly offset start and end times also over DST changes', () => {
      const recurrenceRule = rrulestr('DTSTART:20240323T130000\nRRULE:FREQ=WEEKLY;BYDAY=MO;UNTIL=20250109T140000')
      const date = new DateModel({
        startDate: DateTime.fromISO('2024-01-09T14:00:00.000+01:00'),
        endDate: DateTime.fromISO('2024-01-09T16:00:00.000+01:00'),
        allDay: false,
        recurrenceRule,
      })

      expect(date.recurrences(3)).toEqual([
        new DateModel({
          allDay: false,
          recurrenceRule,
          startDate: DateTime.fromISO('2024-03-25T14:00:00.000+01:00'),
          endDate: DateTime.fromISO('2024-03-25T16:00:00.000+01:00'),
          offset: 60,
        }),
        new DateModel({
          allDay: false,
          recurrenceRule,
          startDate: DateTime.fromISO('2024-04-01T14:00:00.000+02:00'),
          endDate: DateTime.fromISO('2024-04-01T16:00:00.000+02:00'),
          offset: 60,
        }),
        new DateModel({
          allDay: false,
          recurrenceRule,
          startDate: DateTime.fromISO('2024-04-08T14:00:00.000+02:00'),
          endDate: DateTime.fromISO('2024-04-08T16:00:00.000+02:00'),
          offset: 60,
        }),
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
      })

      const recurrence = date.recurrences(1)[0]!

      expect(recurrence.toFormattedString('de', false)).toBe('7. Mai 2024 10:00 - 12:00')
      expect(recurrence.recurrences(1)[0]!.toFormattedString('de', false)).toBe('7. Mai 2024 10:00 - 12:00')
    })
  })
})
