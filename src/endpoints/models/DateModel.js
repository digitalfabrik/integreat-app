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

  toLocaleString (locale) {
    const locales = [ locale, 'en', 'de' ]
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    const oclock = locale === 'de' ? ' Uhr' : ''
    if (this.allDay !== '0') {
      if (this.endDate && this.endDate !== this.startDate) {
        return new Date(this.startDate).toLocaleDateString(locales, options) + ' - ' + new Date(this.endDate).toLocaleDateString(locales, options)
      } else {
        return new Date(this.startDate).toLocaleDateString(locales, options)
      }
    } else {
      if (this.endDate && this.endDate !== this.startDate) {
        return new Date(this.startDate + ' ' + this.startTime).toLocaleString(locales, options) +
          ' - ' + new Date(this.startDate + ' ' + this.startTime).toLocaleString(locales, options) + oclock
      } else if (this.endDate === this.startDate && this.endTime !== this.startTime) {
        return new Date(this.startDate).toLocaleDateString(locales, options) + ', ' +
          new Date(this.startDate + ' ' + this.startTime).toLocaleTimeString(locales, options) + ' - ' +
          new Date(this.endDate + ' ' + this.endTime).toLocaleTimeString(locales, options) + oclock
      } else if (this.startTime) {
        return new Date(this.startDate + ' ' + this.startTime).toLocaleString(locales, options) + oclock
      } else {
        return new Date(this.startDate).toLocaleDateString(locales, options)
      }
    }
  }
}
