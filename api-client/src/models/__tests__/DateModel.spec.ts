import moment from 'moment'
import DateModel from '../DateModel'
import DateFormatter from '../../i18n/DateFormatter'
describe('DateModel', () => {
  const locales = ['de', 'en', 'fr', 'ar', 'fa', 'ru']
  // TODO IGAPP-399: Reactivate test
  // eslint-disable-next-line jest/no-disabled-tests
  describe.skip('toTimeSpanString()', () => {
    it('should return start date + time and end date + time', () => {
      const startDate = moment('2017-11-27 19:30:00')
      const endDate = moment('2017-11-28 21:30:00')
      const allDay = false
      const date = new DateModel({
        startDate,
        endDate,
        allDay
      })
      expect(locales.map(locale => `${locale}: ${date.toFormattedString(new DateFormatter(locale))}`)).toMatchSnapshot()
    })
    it('should return only start date + time and end time if the dates are the same', () => {
      const startDate = moment('2017-11-27 19:30:00')
      const endDate = moment('2017-11-27 21:30:00')
      const allDay = false
      const date = new DateModel({
        startDate,
        endDate,
        allDay
      })
      expect(
        locales.map(locale => `${locale}: ${date.toFormattedString(new DateFormatter(locale, undefined))}`)
      ).toMatchSnapshot()
    })
    it('should return only start date + time if start and end are the same', () => {
      const startDate = moment('2017-11-27 19:30:00')
      const endDate = moment('2017-11-27 19:30:00')
      const allDay = false
      const date = new DateModel({
        startDate,
        endDate,
        allDay
      })
      expect(
        locales.map(locale => `${locale}: ${date.toFormattedString(new DateFormatter(locale, undefined))}`)
      ).toMatchSnapshot()
    })
    it('should return only start date + end date if allDay is true', () => {
      const startDate = moment('2017-11-27 19:30:00')
      const endDate = moment('2017-11-28 21:30:00')
      const allDay = true
      const date = new DateModel({
        startDate,
        endDate,
        allDay
      })
      expect(
        locales.map(locale => `${locale}: ${date.toFormattedString(new DateFormatter(locale, undefined))}`)
      ).toMatchSnapshot()
    })
    it('should return only start date if allDay is true and the dates are the same', () => {
      const startDate = moment('2017-11-27 19:30:00')
      const endDate = moment('2017-11-27 21:30:00')
      const allDay = true
      const date = new DateModel({
        startDate,
        endDate,
        allDay
      })
      expect(
        locales.map(locale => `${locale}: ${date.toFormattedString(new DateFormatter(locale, undefined))}`)
      ).toMatchSnapshot()
    })
    it('should only return start date (+ time) if endDate is not valid', () => {
      const startDate = moment('2017-11-27 19:30:00')
      const endDate = moment('')
      const allDay = false
      const date = new DateModel({
        startDate,
        endDate,
        allDay
      })
      expect(
        locales.map(locale => `${locale}: ${date.toFormattedString(new DateFormatter(locale, undefined))}`)
      ).toMatchSnapshot()
    })
  })
})