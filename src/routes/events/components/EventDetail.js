// @flow

import React from 'react'
import type { TFunction } from 'react-i18next'
import { translate } from 'react-i18next'
import styled from 'styled-components'
import RemoteContent from 'modules/common/components/RemoteContent'

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

const Thumbnail = styled.img`
  display: flex;
  width: 300px;
  height: 300px;
  margin: 10px auto;
  padding-bottom: 10px;
  object-fit: contain;
`

const Identifier = styled.span`
  font-weight: 700;
`

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
      <>
        <Thumbnail src={event.thumbnail || this.getEventPlaceholder()} />
        <Caption title={event.title} />
        <div>
          <Identifier>{this.props.t('date')}: </Identifier>
          <TimeSpan allDay={event.allDay}
                    startDate={event.startDate}
                    endDate={event.endDate}
                    locale={this.props.language} />
        </div>
        <div>
          <Identifier>{this.props.t('location')}: </Identifier>
          <span>{event.address}</span>
        </div>
        <RemoteContent dangerouslySetInnerHTML={{__html: event.content}} onInternLinkClick={onInternalLinkClick} />
      </>
    )
  }
}

export default translate('events')(EventDetail)
