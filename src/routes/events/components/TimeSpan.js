import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

class TimeSpan extends React.Component {
  static propTypes = {
    startDate: PropTypes.instanceOf(moment).isRequired,
    endDate: PropTypes.instanceOf(moment).isRequired,
    allDay: PropTypes.bool.isRequired,
    locale: PropTypes.string.isRequired
  }

  /**
   * Returns a nicely formatted string containing all relevant start and end date and time information formatted in
   * the locale of the props
   * @return {String} The formatted span string
   */
  toTimeSpanString () {
    const startDate = this.props.startDate
    const endDate = this.props.endDate

    startDate.locale(this.props.locale)

    // if allDay: only date, else: date + time
    let span = this.props.allDay ? startDate.format('LL') : startDate.format('LLL')

    if (endDate.isValid() && !startDate.isSame(endDate)) {
      // endDate is valid and different from startDate

      endDate.locale(this.props.locale)
      if (startDate.isSame(endDate, 'day')) {
        // startDate and endDate are on the same day

        // if allDay: we don't need anything more, because we are on the same day, else: only time
        span += this.props.allDay ? '' : ' - ' + endDate.format('LT')
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
    return <span>{this.toTimeSpanString()}</span>
  }
}

export default TimeSpan
