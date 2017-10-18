import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'

import FontAwesome from 'react-fontawesome'

import style from './EventSnippet.css'
import EventModel from 'endpoints/models/EventModel'
import Navigation from 'Navigation'
import { Link } from 'redux-little-router'

class EventSnippet extends React.Component {
  static propTypes = {
    events: PropTypes.arrayOf(PropTypes.instanceOf(EventModel)).isRequired,
    navigation: PropTypes.instanceOf(Navigation).isRequired
  }

  render () {
    const {t} = this.props

    return <Link className={style.events} href={this.props.navigation.events}>
      <FontAwesome name="calendar" className={style.calendarIcon}/>
      <div className={style.eventsContainer}>
        <div><strong>{t('common:currentEvents')}:</strong></div>
        {this.props.events.slice(0, 2).map((event) => <div key={event.id} className={style.event}>{event.title}</div>)}
        {this.props.events.length > 2 ? <div className={style.event}><em>{t('common:AndMore')}</em></div> : ''}
      </div>
    </Link>
  }
}

export default translate('common')(EventSnippet)
