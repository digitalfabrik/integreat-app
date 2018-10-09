// @flow

import * as React from 'react'
import type { TFunction } from 'react-i18next'
import { translate } from 'react-i18next'
import { isEmpty } from 'lodash/lang'

import ListElement from './ListElement'
import Caption from '../../../modules/common/components/Caption'

import EventModel from '../../../modules/endpoint/models/EventModel'
import styled from 'styled-components'
import EventListElementInfo from './EventListElementInfo'
import EventPlaceholder1 from '../assets/EventPlaceholder1.jpg'
import EventPlaceholder2 from '../assets/EventPlaceholder2.jpg'
import EventPlaceholder3 from '../assets/EventPlaceholder3.jpg'

type PropsType = {|
  events: Array<EventModel>,
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
  /**
   * We have three placeholder thumbnails to display when cities don't provide a thumbnail
   * @returns {*} The Placeholder Thumbnail
   */
  getEventPlaceholder (id: number): string {
    const placeholders = [EventPlaceholder1, EventPlaceholder2, EventPlaceholder3]
    return placeholders[id % placeholders.length]
  }

  render () {
    const {t, language, events, onInternalLinkClick} = this.props

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
          {events.map(event => <ListElement key={event.path}
                                            thumbnail={event.thumbnail || this.getEventPlaceholder(event.id)}
                                            title={event.title}
                                            path={event.path}
                                            onInternalLinkClick={onInternalLinkClick} >
            <EventListElementInfo language={language}
                                  onInternalLinkClick={onInternalLinkClick}
                                  location={event.location}
                                  excerpt={event.excerpt}
                                  date={event.date} />

          </ListElement>)
          }
        </List>
      </>
    )
  }
}

export default translate('events')(EventList)
