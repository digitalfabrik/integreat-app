import React from 'react'
import { translate } from 'react-i18next'
import { isEmpty } from 'lodash/lang'

import EventListElement from './EventListElement'
import Caption from 'modules/common/components/Caption'

import style from './EventList.css'
import type { EventType } from '../../../modules/endpoint/types'

type Props = {
  events: Array<EventType>,
  url: string,
  language: string,
  t: (string) => string
}

/**
 * Display a list of events
 */
class EventList extends React.Component<Props> {
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
