import DateModel from '../DateModel'
import moment from 'moment'

describe('DateModel', () => {
  const locales = ['de', 'en', 'fr', 'ar', 'fa', 'ru']
  test('should return correct attributes', () => {
    const props = {
      startDate: moment('2017-11-27 19:30:00'),
      endDate: moment('2017-11-27 21:30:00'),
      allDay: false
    }
    const dateModel = new DateModel(props)

    expect(dateModel.startDate).toEqual(props.startDate)
    expect(dateModel.endDate).toEqual(props.endDate)
    expect(dateModel.allDay).toEqual(props.allDay)
  })

  test('toTimeSpanString() should return start date + time and end date + time', () => {
    const props = {
      startDate: moment('2017-11-27 19:30:00'),
      endDate: moment('2017-11-28 21:30:00'),
      allDay: false
    }
    const dateModel = new DateModel(props)

    expect(locales.map(locale => locale + ': ' + dateModel.toTimeSpanString(locale))).toMatchSnapshot()
  })

  test('toTimeSpanString() should return only start date + time and end time if the dates are the same', () => {
    const props = {
      startDate: moment('2017-11-27 19:30:00'),
      endDate: moment('2017-11-27 21:30:00'),
      allDay: false
    }
    const dateModel = new DateModel(props)

    expect(locales.map(locale => locale + ': ' + dateModel.toTimeSpanString(locale))).toMatchSnapshot()
  })

  test('toTimeSpanString() should return only start date + time if start and end are the same', () => {
    const props = {
      startDate: moment('2017-11-27 19:30:00'),
      endDate: moment('2017-11-27 19:30:00'),
      allDay: false
    }
    const dateModel = new DateModel(props)

    expect(locales.map(locale => locale + ': ' + dateModel.toTimeSpanString(locale))).toMatchSnapshot()
  })

  test('toTimeSpanString() should return only start date + end date if allDay is true', () => {
    const props = {
      startDate: moment('2017-11-27 19:30:00'),
      endDate: moment('2017-11-28 21:30:00'),
      allDay: true
    }
    const dateModel = new DateModel(props)

    expect(locales.map(locale => locale + ': ' + dateModel.toTimeSpanString(locale))).toMatchSnapshot()
  })

  test('toTimeSpanString() should return only start date if allDay is true and the dates are the same', () => {
    const props = {
      startDate: moment('2017-11-27 19:30:00'),
      endDate: moment('2017-11-27 21:30:00'),
      allDay: true
    }
    const dateModel = new DateModel(props)

    expect(locales.map(locale => locale + ': ' + dateModel.toTimeSpanString(locale))).toMatchSnapshot()
  })

  test('toTimeSpanString() should only return start date (+ time) if endDate is not valid', () => {
    const props = {
      startDate: moment('2017-11-27 19:30:00'),
      endDate: moment(''),
      allDay: false
    }
    const dateModel = new DateModel(props)

    expect(locales.map(locale => locale + ': ' + dateModel.toTimeSpanString(locale))).toMatchSnapshot()
  })
})
