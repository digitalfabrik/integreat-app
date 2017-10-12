export default class DateModel {
  constructor ({ startDate, endDate, allDay }) {
    this._startDate = startDate
    this._endDate = endDate
    this._allDay = allDay
  }

  /*
  * (!) startDate and endDate are not in German, but UTC TimeZone. They are sent in German timezone by Server, but without any
  * timezone declaration, so we don't know if it's DaylightSavingTime or not. So we parse it in UTC and display it in UTC.
  */
  get startDate () {
    return this._startDate
  }

  /*
  * (!) startDate and endDate are not in German, but UTC TimeZone. They are sent in German timezone by Server, but without any
  * timezone declaration, so we don't know if it's DaylightSavingTime or not. So we parse it in UTC and display it in UTC.
  */
  get endDate () {
    return this._endDate
  }

  get allDay () {
    return this._allDay
  }

  /* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString#Checking_for_support_for_locales_and_options_arguments */
  static isToLocaleStringSupported () {
    try {
      new Date().toLocaleTimeString('i')
    } catch (e) {
      return true
    }
    return false
  }

  static toDateTimeString (date, locale) {
    if (DateModel.isToLocaleStringSupported()) {
      return date.toLocaleString([locale, 'en-US'], {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC'
      })
    } else {
      return date.toDateString() + ', ' + date.toTimeString()
    }
  }

  static toDateString (date, locale) {
    if (DateModel.isToLocaleStringSupported()) {
      return date.toLocaleDateString([locale, 'en-US'], {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC'
      })
    } else {
      return date.toDateString()
    }
  }

  static toTimeString (date, locale) {
    if (DateModel.isToLocaleStringSupported()) {
      return date.toLocaleTimeString([locale, 'en-US'], {hour: '2-digit', minute: '2-digit', timeZone: 'UTC'})
    } else {
      return date.toTimeString()
    }
  }

  toLocaleString (locale) {
    const oClock = locale === 'de' ? ' Uhr' : ''
    if (!this.allDay) {
      if (this.endDate && this.endDate !== this.startDate) {
        return DateModel.toDateString(this.startDate, locale) + ' - ' + DateModel.toDateString(this.endDate, locale)
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
