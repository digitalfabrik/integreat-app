// @flow

import React from 'react'
import type { Moment } from 'moment'

type PropsType = {
  startDate: Moment,
  endDate: Moment,
  allDay: boolean,
  locale: string
}

class TimeSpan extends React.Component<PropsType> {
  /**
   * Returns a formatted string containing all relevant start and end date and time information
   * @param {String} locale The locale to format the span in
   * @return {String} The formatted span string
   */
  toTimeSpanString (locale: string): string {
    const startDate = this.props.startDate
    const endDate = this.props.endDate

    startDate.locale(locale)

    // if allDay: only date, else: date + time
    let span = this.props.allDay ? startDate.format('LL') : startDate.format('LLL')

    if (endDate.isValid() && !startDate.isSame(endDate)) {
      // endDate is valid and different from startDate

      endDate.locale(locale)
      if (startDate.isSame(endDate, 'day')) {
        // startDate and endDate are on the same day

        // if allDay: we don't need anything more, because we are on the same day, else: only time
        span += this.props.allDay ? '' : ` - ${endDate.format('LT')}`
      } else {
        // startDate and endDate are not on the same day

        span += ' - '
        // if allDay: only date, else: date + time
        span += this.props.allDay ? endDate.format('LL') : endDate.format('LLL')
      }
    }
    return span
  }

  render () {
    return <span>{this.toTimeSpanString(this.props.locale)}</span>
  }
}

export default TimeSpan
