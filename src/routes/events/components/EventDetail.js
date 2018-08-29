// @flow

import React from 'react'
import type { TFunction } from 'react-i18next'
import { translate } from 'react-i18next'

import RemoteContent from 'modules/common/components/RemoteContent'

import style from './EventDetail.css'
import EventPlaceholder1 from '../assets/EventPlaceholder1.jpg'
import EventPlaceholder2 from '../assets/EventPlaceholder2.jpg'
import EventPlaceholder3 from '../assets/EventPlaceholder3.jpg'
import Caption from 'modules/common/components/Caption'
import TimeSpan from './TimeSpan'
import EventModel from 'modules/endpoint/models/EventModel'

type PropsType = {
  event: EventModel,
  language: string,
  t: TFunction,
  onInternalLinkClick: string => void
}

/**
 * Display a single event with all necessary information
 */
class EventDetail extends React.Component<PropsType> {
  getEventPlaceholder (): string {
    const placeholders = [EventPlaceholder1, EventPlaceholder2, EventPlaceholder3]
    return placeholders[this.props.event.id % placeholders.length]
  }

  render () {
    const {event, onInternalLinkClick} = this.props
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
        <RemoteContent dangerouslySetInnerHTML={{__html: event.content}} onInternLinkClick={onInternalLinkClick} />
      </div>
    )
  }
}

export default translate('events')(EventDetail)
