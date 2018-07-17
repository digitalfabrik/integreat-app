// @flow

import * as React from 'react'
import { translate } from 'react-i18next'
import { isEmpty } from 'lodash/lang'

import EventListElement from './EventListElement'
import Caption from 'modules/common/components/Caption'

import style from './EventList.css'
import EventModel from '../../../modules/endpoint/models/EventModel'
import type { I18nTranslateType } from '../../../flowTypes'

type PropsType = {
  events: Array<EventModel>,
  city: string,
  language: string,
  t: I18nTranslateType
}

/**
 * Display a list of events
 */
class EventList extends React.Component<PropsType> {
  render () {
    const {t, city, language, events} = this.props

    if (isEmpty(events)) {
      return (
        <div>
          <Caption title={t('news')} />
          <div className={style.noEvents}>
            {t('currentlyNoEvents')}
          </div>
        </div>
      )
    }

    const elements = events.map(event =>
      <EventListElement key={event.id}
                        event={event}
                        city={city}
                        language={language} />
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
