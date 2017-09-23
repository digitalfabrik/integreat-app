export default class DateModel {
  constructor ({ startDate, startTime = '00:00:00', endDate, endTime, allDay = false }) {
    this._startDate = startDate
    this._startTime = startTime
    this._endDate = endDate
    this._endTime = endTime
    this._allDay = allDay
  }

  get startDate () {
    return this._startDate
  }

  get startTime () {
    return this._startTime
  }

  get endDate () {
    return this._endDate
  }

  get endTime () {
    return this._endTime
  }

  get allDay () {
    return this._allDay
  }

  static toLocaleDateTime (value, locale) {
    const locales = [ locale, 'en', 'de' ]
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    return new Date(value).toLocaleString(locales, options)
  }

  static toLocaleDate (value, locale) {
    const locales = [ locale, 'en', 'de' ]
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(value).toLocaleDateString(locales, options)
  }

  static toLocaleTime (value, locale) {
    const locales = [ locale, 'en', 'de' ]
    const options = { hour: '2-digit', minute: '2-digit' }
    return new Date(value).toLocaleTimeString(locales, options)
  }

  toLocaleString (locale) {
    const oClock = locale === 'de' ? ' Uhr' : ''
    if (this.allDay !== '0') {
      if (this.endDate && this.endDate !== this.startDate) {
        return DateModel.toLocaleDate(this.startDate, locale) + ' - ' + this.toLocaleDate(this.endDate, locale)
      } else {
        return DateModel.toLocaleDate(this.startDate, locale)
      }
    } else {
      if (this.endDate && this.endDate !== this.startDate) {
        return DateModel.toLocaleDateTime(this.startDate + ' ' + this.startTime, locale) + oClock +
          ' - ' + DateModel.toLocaleDateTime(this.endDate + ' ' + this.endTime) + oClock
      } else if (this.endDate === this.startDate && this.endTime !== this.startTime) {
        return DateModel.toLocaleDateTime(this.startDate + ' ' + this.startTime, locale) + ' - ' +
          DateModel.toLocaleTime(this.endDate + ' ' + this.endTime, locale) + oClock
      } else if (DateModel.startTime) {
        return DateModel.toLocaleDateTime(this.startDate + ' ' + this.startTime, locale) + oClock
      } else {
        return DateModel.toLocaleDate(this.startDate, locale)
      }
    }
  }
}
