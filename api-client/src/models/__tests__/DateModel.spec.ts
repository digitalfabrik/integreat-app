import { DateTime } from 'luxon'
import { rrulestr } from 'rrule'

import DateModel from '../DateModel'

jest.useFakeTimers({ now: new Date('2023-10-02T15:23:57.443+02:00') })
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
        startDate: DateTime.fromISO('2023-10-02T20:00:00.000+02:00'),
        endDate: DateTime.fromISO('2023-10-04T07:00:00.000+02:00'),
        allDay: false,
        recurrenceRule: null,
      })

      expect(date.isToday).toBe(true)
    })

    it('should return true if event ends on the current day', () => {
      const date = new DateModel({
        startDate: DateTime.fromISO('2023-10-01T07:00:00.000+02:00'),
        endDate: DateTime.fromISO('2023-10-02T18:00:00.000+02:00'),
        allDay: false,
        recurrenceRule: null,
      })

      expect(date.isToday).toBe(true)
    })

    it('should return true if event started before and ends after the current day', () => {
      const date = new DateModel({
        startDate: DateTime.fromISO('2023-10-01T07:00:00.000+02:00'),
        endDate: DateTime.fromISO('2023-10-04T07:00:00.000+02:00'),
        allDay: false,
        recurrenceRule: null,
      })

      expect(date.isToday).toBe(true)
    })
  })

  describe('recurrences', () => {
    it('should update start and end date according to recurrence rule and ignore delivered dates', () => {
      const date = new DateModel({
        startDate: DateTime.fromISO('2017-09-27T19:30:00+02:00'),
        endDate: DateTime.fromISO('2017-09-28T21:30:00+02:00'),
        allDay: false,
        recurrenceRule: rrulestr('DTSTART:20230414T050000\nRRULE:FREQ=WEEKLY;BYDAY=MO'),
      })

      expect(date.startDate).toEqual(DateTime.fromISO('2023-10-09T07:00:00.000+02:00'))
      expect(date.endDate).toEqual(DateTime.fromISO('2023-10-10T09:00:00.000+02:00'))
    })

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
      const date = new DateModel({
        startDate: DateTime.fromISO('2017-09-27T19:30:00+02:00'),
        endDate: DateTime.fromISO('2017-09-28T21:30:00+02:00'),
        allDay: false,
        recurrenceRule: rrulestr('DTSTART:20230414T050000\nRRULE:FREQ=WEEKLY;BYDAY=MO'),
      })

      expect(date.recurrences(4)).toEqual([
        new DateModel({
          allDay: false,
          recurrenceRule: null,
          startDate: DateTime.fromISO('2023-10-09T07:00:00.000+02:00'),
          endDate: DateTime.fromISO('2023-10-10T09:00:00.000+02:00'),
        }),
        new DateModel({
          allDay: false,
          recurrenceRule: null,
          startDate: DateTime.fromISO('2023-10-16T07:00:00.000+02:00'),
          endDate: DateTime.fromISO('2023-10-17T09:00:00.000+02:00'),
        }),
        new DateModel({
          allDay: false,
          recurrenceRule: null,
          startDate: DateTime.fromISO('2023-10-23T07:00:00.000+02:00'),
          endDate: DateTime.fromISO('2023-10-24T09:00:00.000+02:00'),
        }),
        new DateModel({
          allDay: false,
          recurrenceRule: null,
          startDate: DateTime.fromISO('2023-10-30T07:00:00.000+01:00'),
          endDate: DateTime.fromISO('2023-10-31T09:00:00.000+01:00'),
        }),
      ])
    })

    it('should return less recurrences if rrule ends', () => {
      const date = new DateModel({
        startDate: DateTime.fromISO('2017-09-27T19:30:00+02:00'),
        endDate: DateTime.fromISO('2017-09-28T21:30:00+02:00'),
        allDay: false,
        recurrenceRule: rrulestr('DTSTART:20230414T050000\nRRULE:FREQ=WEEKLY;BYDAY=MO;UNTIL=20231015T050000'),
      })

      expect(date.recurrences(3)).toEqual([
        new DateModel({
          allDay: false,
          recurrenceRule: null,
          startDate: DateTime.fromISO('2023-10-09T07:00:00.000+02:00'),
          endDate: DateTime.fromISO('2023-10-10T09:00:00.000+02:00'),
        }),
      ])
    })
  })
})
