// @flow

import * as React from 'react'
import type { TFunction } from 'react-i18next'
import { translate } from 'react-i18next'
import { isEmpty } from 'lodash/lang'

import EventListElement from './EventListElement'
import Caption from 'modules/common/components/Caption'

import EventModel from '../../../modules/endpoint/models/EventModel'
import styled from 'styled-components'

type PropsType = {|
  events: Array<EventModel>,
  city: string,
  language: string,
  t: TFunction,
  onInternalLinkClick: string => void
|}

const NoEvents = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 25px;
`

const List = styled.div`
  border-top: 2px solid ${props => props.theme.colors.themeColor};
`

/**
 * Display a list of events
 */
class EventList extends React.Component<PropsType> {
  render () {
    const {t, city, language, events, onInternalLinkClick} = this.props

    if (isEmpty(events)) {
      return (
        <>
          <Caption title={t('news')} />
          <NoEvents>{t('currentlyNoEvents')}</NoEvents>
        </>
      )
    }

    return (
      <>
        <Caption title={t('news')} />
        <List>
          {events.map(event => <EventListElement key={event.path}
                                                 event={event}
                                                 city={city}
                                                 language={language}
                                                 onInternalLinkClick={onInternalLinkClick} />)}
        </List>
      </>
    )
  }
}

export default translate('events')(EventList)
