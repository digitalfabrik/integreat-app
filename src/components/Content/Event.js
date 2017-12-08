import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import compose from 'lodash/fp/compose'

import EventModel from '../../endpoints/models/EventModel'
import RemoteContent from './RemoteContent'
import Caption from './Caption'
import { setAvailableLanguages } from '../../actions'

import style from './Event.css'
import EventPlaceholder1 from './assets/EventPlaceholder1.jpg'
import EventPlaceholder2 from './assets/EventPlaceholder2.jpg'
import EventPlaceholder3 from './assets/EventPlaceholder3.jpg'

/**
 * Display a single event
 */
class Event extends React.Component {
  static propTypes = {
    event: PropTypes.shape({
      event: PropTypes.instanceOf(EventModel).isRequired,
      thumbnailPlaceholder: PropTypes.number.isRequired
    }).isRequired,
    language: PropTypes.string.isRequired
  }

  componentDidMount () {
    if (this.props.event.event.availableLanguages) {
      this.props.dispatch(setAvailableLanguages(this.props.event.event.availableLanguages))
    }
  }

  componentWillUnmount () {
    this.props.dispatch(setAvailableLanguages({}))
  }

  getEventPlaceholder () {
    return (
      this.props.event.thumbnailPlaceholder % 3 === 0 ? EventPlaceholder1
        : this.props.event.thumbnailPlaceholder % 3 === 1 ? EventPlaceholder2
        : EventPlaceholder3
    )
  }

  render () {
    const {t} = this.props
    return (
      <div>
        <img className={style.thumbnail} src={this.props.event.event.thumbnail || this.getEventPlaceholder()}/>
        <Caption title={this.props.event.event.title}/>
        <div>
          <span className={style.identifier}>{t('events:date')}: </span>
          <span className={style.date}>{this.props.event.event.getDate(this.props.language)}</span>
        </div>
        <div>
          <span className={style.identifier}>{t('events:location')}: </span>
          <span className={style.date}>{this.props.event.event.address}</span>
        </div>
        <RemoteContent dangerouslySetInnerHTML={{__html: this.props.event.event.content}}/>
      </div>
    )
  }
}

export default compose(
  connect(),
  translate('events')
)(Event)
