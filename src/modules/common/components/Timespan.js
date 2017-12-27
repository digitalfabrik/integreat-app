import React from 'react'
import PropTypes from 'prop-types'

class Timespan extends React.Component {
  static propTypes = {
    startDate: PropTypes.instanceOf(Date).isRequired,
    endDate: PropTypes.instanceOf(Date).isRequired,
    /**
     * The localization to be used in formatting.
     */
    locale: PropTypes.string.isRequired
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
    if (Timespan.isToLocaleStringSupported()) {
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
    if (Timespan.isToLocaleStringSupported()) {
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
    if (Timespan.isToLocaleStringSupported()) {
      return date.toLocaleTimeString([locale, 'en-US'], {hour: '2-digit', minute: '2-digit', timeZone: 'UTC'})
    } else {
      return date.toTimeString()
    }
  }

  /**
   * Returns a nicely formatted, localized string containing start and - if available - endDate.
   * Times are included if allDay is false.
   * @return {string} nicely formatted, localized string containing the date's information.
   */
  toLocaleString () {
    const locale = this.props.locale
    const startDate = this.props.startDate
    const endDate = this.props.endDate
    const oClock = locale === 'de' ? ' Uhr' : ''
    if (this.allDay) {
      if (endDate && endDate !== startDate) {
        return Timespan.toDateString(startDate, locale) + ' - ' + Timespan.toDateString(endDate, locale)
      } else {
        return Timespan.toDateString(startDate, locale)
      }
    } else if (!endDate || endDate.toString() === startDate.toString()) {
      return Timespan.toDateTimeString(startDate, locale)
    } else if (startDate.toDateString() === endDate.toDateString()) {
      return Timespan.toDateTimeString(startDate, locale) + ' - ' + Timespan.toTimeString(endDate, locale) + oClock
    } else {
      return Timespan.toDateTimeString(startDate, locale) + oClock + ' - ' + Timespan.toDateTimeString(endDate, locale) + oClock
    }
  }

  render () {
    return <span>{this.toLocaleString()}</span>
  }
}

export default Timespan
