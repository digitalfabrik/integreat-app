import React from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash/collection'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { isEmpty } from 'lodash'

import EventModel from '../../endpoints/models/EventModel'
import style from './Events.css'

class Events extends React.Component {
  static propTypes = {
    events: PropTypes.arrayOf(PropTypes.instanceOf(EventModel)).isRequired
  }

  render () {
    const { t } = this.props
    return <div className={style.eventsContainer}>
      {
        map(this.props.events, event => (
          <div key={event.id} className={style.eventContainer}>
            <div>
              { !isEmpty(event.thumbnail) ? <img className={style.eventThumbnail} src={event.thumbnail} /> : '' }
              <div className={style.eventTitle}>{event.title}</div>
              <div><strong>{t('common:date')}: </strong>{event.getDate(this.props.language)}</div>
              { !isEmpty(event.address) ? <div><strong>{t('common:address')}: </strong>{event.address}</div> : '' }
            </div>
            <div dangerouslySetInnerHTML={{__html: event.content}}/>
          </div>))
      }
    </div>
  }
}

export default connect((state) => ({ language: state.router.params.language }))(translate('common')(Events))
