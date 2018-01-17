import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import { isEmpty } from 'lodash/lang'

import EventListElement from './EventListElement'
import EventModel from 'modules/endpoint/models/EventModel'
import Caption from 'modules/common/components/Caption'

import style from './EventList.css'

/**
 * Display a list of events
 */
class EventList extends React.Component {
  static propTypes = {
    events: PropTypes.arrayOf(PropTypes.instanceOf(EventModel)).isRequired,
    url: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired
  }

  render () {
    const {t} = this.props

    if (isEmpty(this.props.events)) {
      return (
        <div>
          <Caption title={t('news')} />
          <div className={style.noEvents}>
            {t('currentlyNoEvents')}
          </div>
        </div>
      )
    }

    const elements = this.props.events.map(event =>
      <EventListElement key={event.id}
                        event={event}
                        parentUrl={this.props.url}
                        language={this.props.language} />
    )

    return (
      <React.Fragment>
        <Caption title={t('news')} />
        <div className={style.list}>
          {elements}
        </div>
      </React.Fragment>
    )
  }
}

export default translate('events')(EventList)
