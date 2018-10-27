// @flow

import * as React from 'react'
import type { TFunction } from 'react-i18next'
import { translate } from 'react-i18next'

import ListItem from '../../../modules/common/components/ListItem'
import Caption from '../../../modules/common/components/Caption'

import EventModel from '../../../modules/endpoint/models/EventModel'
import EventListItemInfo from './EventListItemInfo'
import EventPlaceholder1 from '../assets/EventPlaceholder1.jpg'
import EventPlaceholder2 from '../assets/EventPlaceholder2.jpg'
import EventPlaceholder3 from '../assets/EventPlaceholder3.jpg'
import List from '../../../modules/common/components/List'

type OnInternalLinkClickType = string => void

type PropsType = {|
  events: Array<EventModel>,
  language: string,
  t: TFunction,
  onInternalLinkClick: OnInternalLinkClickType
|}

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

  renderEvent (language: string, onInternalLinkClick: OnInternalLinkClickType): EventModel => React.Node {
    return (event: EventModel): React.Node => {
      return (
        <ListItem key={event.path}
                  thumbnail={event.thumbnail || this.getEventPlaceholder(event.id)}
                  title={event.title}
                  path={event.path}>
          <EventListItemInfo language={language}
                             onInternalLinkClick={onInternalLinkClick}
                             location={event.location}
                             excerpt={event.excerpt}
                             date={event.date} />
        </ListItem>
      )
    }
  }

  render () {
    const {events, language, onInternalLinkClick, t} = this.props
    return (
      <>
        <Caption title={t('news')} />
        <List noItemsMessage={t('currentlyNoEvents')}
              items={events}
              renderItem={this.renderEvent(language, onInternalLinkClick)} />
      </>
    )
  }
}

export default translate('events')(EventList)
