export default class DateModel {
  constructor ({ startDate, endDate, allDay }) {
    this._startDate = startDate
    this._endDate = endDate
    this._allDay = allDay
  }

  /**
  * (!) startDate and endDate are not in German, but UTC-Timezone. They are sent in German timezone by Server, but without any
  * timezone declaration, so we don't know if it's DaylightSavingTime or not. So we parse it in UTC and display it in UTC.
  * @return {Date} the Date when the event ends. If it's not specified, then null. Must be displayed in UTC-Timezone.
  */
  get startDate () {
    return this._startDate
  }

  /**
  * @return {Date} the Date when the event starts. Must be displayed in UTC-Timezone.
  */
  get endDate () {
    return this._endDate
  }

  /** @return {boolean} true, if event is all day long. */
  get allDay () {
    return this._allDay
  }

  /**
   * @return {boolean} true, if toLocaleString is supported on the Date Prototype.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString#Checking_for_support_for_locales_and_options_arguments
   */
  static isToLocaleStringSupported () {
    try {
      new Date().toLocaleTimeString('i')
    } catch (e) {
      return true
    }
    return false
  }

  /**
   * @param{Date} date
   * @param{string} locale
   * @return {string} string containing formatted and localized time and date of the Date object.
   */
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

  /**
   * @param{Date} date
   * @param{string} locale
   * @return {string} string containing formatted and localized time of the date.
   */
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

  /**
   * @param{Date} date
   * @param{string} locale
   * @return {string} string containing formatted and localized time of the date.
   */
  static toTimeString (date, locale) {
    if (DateModel.isToLocaleStringSupported()) {
      return date.toLocaleTimeString([locale, 'en-US'], {hour: '2-digit', minute: '2-digit', timeZone: 'UTC'})
    } else {
      return date.toTimeString()
    }
  }

  /**
   * Returns a nicely formatted, localized string containing start and - if available - endDate.
   * Times are included if allDay is false.
   * @param{string} locale The localization to be used in formatting.
   * @return {string} nicely formatted, localized string containing the date's information.
   */
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
