export default class DateModel {
  constructor ({ startDate, endDate, allDay }) {
    this._startDate = startDate
    this._endDate = endDate
    this._allDay = allDay
  }

  get startDate () {
    return this._startDate
  }

  get endDate () {
    return this._endDate
  }

  get allDay () {
    return this._allDay
  }

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString#Checking_for_support_for_locales_and_options_arguments
  static toLocaleStringSupportsLocales () {
    try {
      new Date().toLocaleTimeString('i')
    } catch (e) {
      return e.name === 'RangeError'
    }
    return false
  }

  static toDateTimeString (date, locale) {
    if (DateModel.toLocaleStringSupportsLocales()) {
      return date.toLocaleString([locale, 'en-US'], {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } else {
      return date.toDateString() + ', ' + date.toTimeString()
    }
  }

  static toDateString (date, locale) {
    if (DateModel.toLocaleStringSupportsLocales()) {
      return date.toLocaleDateString([locale, 'en-US'], {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } else {
      return date.toDateString()
    }
  }

  static toTimeString (date, locale) {
    if (DateModel.toLocaleStringSupportsLocales()) {
      return date.toLocaleTimeString([locale, 'en-US'], {hour: '2-digit', minute: '2-digit'})
    } else {
      return date.toTimeString()
    }
  }

  toLocaleString (locale) {
    const oClock = locale === 'de' ? ' Uhr' : ''
    if (!this.allDay) {
      if (this.endDate && this.endDate !== this.startDate) {
        return DateModel.toDateString(this.startDate, locale) + ' - ' + this.toDateString(this.endDate, locale)
      } else {
        return DateModel.toDateString(this.startDate, locale)
      }
    } else if (!this.endDate || this.endDate.toString() === this.startDate.toString()) {
      return DateModel.toDateTimeString(this.startDate, locale)
    } else if (this.startDate.toDateString() === this.endDate.toDateString()) {
      return DateModel.toDateTimeString(this.startDate, locale) + ' - ' + DateModel.toTimeString(this.endDate, locale) + oClock
    } else {
      return DateModel.toDateTimeString(this.startDate, locale) + oClock + ' - ' + DateModel.toDateTimeString(this.endDate, locale) + oClock
    }
  }
}
