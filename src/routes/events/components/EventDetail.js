import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'

import EventModel from 'modules/endpoint/models/EventModel'
import RemoteContent from 'modules/common/components/RemoteContent'

import style from './EventDetail.css'
import EventPlaceholder1 from '../assets/EventPlaceholder1.jpg'
import EventPlaceholder2 from '../assets/EventPlaceholder2.jpg'
import EventPlaceholder3 from '../assets/EventPlaceholder3.jpg'
import Caption from 'modules/common/components/Caption'
import TimeSpan from './TimeSpan'

/**
 * Display a single event with all necessary information
 */
class EventDetail extends React.Component {
  static propTypes = {
    event: PropTypes.instanceOf(EventModel).isRequired,
    language: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired
  }

  getEventPlaceholder () {
    const placeholders = [EventPlaceholder1, EventPlaceholder2, EventPlaceholder3]
    return placeholders[this.props.event.id % 3]
  }

  render () {
    const event = this.props.event
    return (
      <div>
        <img className={style.thumbnail} src={event.thumbnail || this.getEventPlaceholder()} />
        <Caption title={event.title} />
        <div>
          <span className={style.identifier}>{this.props.t('date')}: </span>
          <TimeSpan className={style.date}
                    allDay={event.allDay}
                    startDate={event.startDate}
                    endDate={event.endDate}
                    locale={this.props.language} />
        </div>
        <div>
          <span className={style.identifier}>{this.props.t('location')}: </span>
          <span className={style.date}>{event.address}</span>
        </div>
        <RemoteContent dangerouslySetInnerHTML={{__html: event.content}} />
      </div>
    )
  }
}

export default translate('events')(EventDetail)
