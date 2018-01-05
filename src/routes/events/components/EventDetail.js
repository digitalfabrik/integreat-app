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

/**
 * Display a single event with all necessary information
 */
class EventDetail extends React.Component {
  static propTypes = {
    event: PropTypes.instanceOf(EventModel).isRequired,
    language: PropTypes.string.isRequired
  }

  getEventPlaceholder () {
    const placeholders = [EventPlaceholder1, EventPlaceholder2, EventPlaceholder3]
    return placeholders[this.props.event.id % 3]
  }

  render () {
    const {t} = this.props
    return (
      <div>
        <img className={style.thumbnail} src={this.props.event.thumbnail || this.getEventPlaceholder()} />
        <Caption title={this.props.event.title} />
        <div>
          <span className={style.identifier}>{t('date')}: </span>
          <span className={style.date}>
            {this.props.event.dateModel.toLocaleString(this.props.language)}
          </span>
        </div>
        <div>
          <span className={style.identifier}>{t('location')}: </span>
          <span className={style.date}>{this.props.event.address}</span>
        </div>
        <RemoteContent dangerouslySetInnerHTML={{__html: this.props.event.content}} />
      </div>
    )
  }
}

export default translate('events')(EventDetail)
