import DateModel from '../DateModel'
import moment from 'moment'

describe('DateModel', () => {
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

  test('toTimeSpanString() should return localized string', () => {
    const props = {
      startDate: moment('2017-11-27 19:30:00'),
      endDate: moment('2017-11-27 21:30:00'),
      allDay: false
    }
    const dateModel = new DateModel(props)

    expect(dateModel.toTimeSpanString('de')).toBe('27. November 2017 19:30 - 21:30')
    expect(dateModel.toTimeSpanString('en')).toBe('November 27, 2017 7:30 PM - 9:30 PM')
    expect(dateModel.toTimeSpanString('fr')).toBe('27 novembre 2017 19:30 - 21:30')
    expect(dateModel.toTimeSpanString('ar')).toBe('٢٧ نوفمبر ٢٠١٧ ١٩:٣٠ - ٢١:٣٠')
    // I don't now if it's correct that farsi and arabic nearly look the same
    expect(dateModel.toTimeSpanString('fa')).toBe('۲۷ نوامبر ۲۰۱۷ ۱۹:۳۰ - ۲۱:۳۰')
    expect(dateModel.toTimeSpanString('ru')).toBe('27 ноября 2017 г., 19:30 - 21:30')
  })

  test('toTimeSpanString() should return start date + time and end date + time', () => {
    const props = {
      startDate: moment('2017-11-27 19:30:00'),
      endDate: moment('2017-11-28 21:30:00'),
      allDay: false
    }
    const dateModel = new DateModel(props)

    expect(dateModel.toTimeSpanString('de')).toBe('27. November 2017 19:30 - 28. November 2017 21:30')
  })

  test('toTimeSpanString() should return only start date + time and end time if the dates are the same', () => {
    const props = {
      startDate: moment('2017-11-27 19:30:00'),
      endDate: moment('2017-11-27 21:30:00'),
      allDay: false
    }
    const dateModel = new DateModel(props)

    expect(dateModel.toTimeSpanString('de')).toBe('27. November 2017 19:30 - 21:30')
  })

  test('toTimeSpanString() should return only start date + time if start and end are the same', () => {
    const props = {
      startDate: moment('2017-11-27 19:30:00'),
      endDate: moment('2017-11-27 19:30:00'),
      allDay: false
    }
    const dateModel = new DateModel(props)

    expect(dateModel.toTimeSpanString('de')).toBe('27. November 2017 19:30')
  })

  test('toTimeSpanString() should return only start date + end date if allDay is true', () => {
    const props = {
      startDate: moment('2017-11-27 19:30:00'),
      endDate: moment('2017-11-28 21:30:00'),
      allDay: true
    }
    const dateModel = new DateModel(props)

    expect(dateModel.toTimeSpanString('de')).toBe('27. November 2017 - 28. November 2017')
  })

  test('toTimeSpanString() should return only start date if allDay is true and the dates are the same', () => {
    const props = {
      startDate: moment('2017-11-27 19:30:00'),
      endDate: moment('2017-11-27 21:30:00'),
      allDay: true
    }
    const dateModel = new DateModel(props)

    expect(dateModel.toTimeSpanString('de')).toBe('27. November 2017')
  })

  test('toTimeSpanString() should only return start date (+ time) if endDate is not valid', () => {
    const props = {
      startDate: moment('2017-11-27 19:30:00'),
      endDate: moment(''),
      allDay: false
    }
    const dateModel = new DateModel(props)

    expect(dateModel.toTimeSpanString('de')).toBe('27. November 2017 19:30')
  })
})
