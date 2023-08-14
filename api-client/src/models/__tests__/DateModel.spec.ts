import { DateTime } from 'luxon'

import DateModel from '../DateModel'

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
      })
      expect(
        locales.map(locale => `${locale}: ${normalizeWhitespaces(date.toFormattedString(locale))}`)
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
      })
      expect(
        locales.map(locale => `${locale}: ${normalizeWhitespaces(date.toFormattedString(locale))}`)
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
      })
      expect(
        locales.map(locale => `${locale}: ${normalizeWhitespaces(date.toFormattedString(locale))}`)
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
      })
      expect(
        locales.map(locale => `${locale}: ${normalizeWhitespaces(date.toFormattedString(locale))}`)
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
      })
      expect(
        locales.map(locale => `${locale}: ${normalizeWhitespaces(date.toFormattedString(locale))}`)
      ).toMatchSnapshot()
    })
  })
})
