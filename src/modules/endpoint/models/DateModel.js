class DateModel {
  constructor ({startDate, endDate, allDay}) {
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
   * Returns a nicely formatted string containing all relevant start and end date and time information
   * @param locale The locale to format the string in
   * @return {String} The formatted span string
   */
  toTimeSpanString (locale) {
    this._startDate.locale(locale)

    // if allDay: only date, else: date + time
    let span = this.allDay ? this.startDate.format('LL') : this.startDate.format('LLL')

    if (this.endDate.isValid() && !this.startDate.isSame(this.endDate)) {
      // endDate is valid and different from startDate

      this._endDate.locale(locale)
      if (this.startDate.isSame(this.endDate, 'day')) {
        // startDate and endDate are on the same day

        // if allDay: we don't need anything more, because we are on the same day, else: only time
        span += this.allDay ? '' : ' - ' + this.endDate.format('LT')
      } else {
        // startDate and endDate are not on the same day

        span += ' - '
        // if allDay: only date, else: date + time
        span += this.allDay ? this.endDate.format('LL') : this.endDate.format('LLL')
      }
    }
    return span
  }
}

export default DateModel
