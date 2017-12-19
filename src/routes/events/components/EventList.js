import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'

import EventListElement from './EventListElement'
import EventModel from 'modules/endpoint/models/EventModel'
import Caption from 'modules/common/components/Caption'

import style from './EventList.css'

class EventList extends React.Component {
  static propTypes = {
    events: PropTypes.arrayOf(PropTypes.instanceOf(EventModel)).isRequired,
    url: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired
  }

  render () {
    const {t} = this.props
    return (
      <div className={style.list}>
        <Caption title={t('news')}/>
        { this.props.events && this.props.events.length !== 0
          ? this.props.events.map((event, index) =>
            <EventListElement key={event.id}
                   event={event}
                   parentUrl={this.props.url}
                   language={this.props.language}
                   isFirst={index === 0}/>)
          : <div className={style.noEvents}>{t('currentlyNoEvents')}</div>
        }
      </div>
    )
  }
}

export default translate('events')(EventList)
