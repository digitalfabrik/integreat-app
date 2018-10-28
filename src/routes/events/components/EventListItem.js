// @flow

import * as React from 'react'
import EventModel from '../../../modules/endpoint/models/EventModel'
import ListItem from '../../../modules/common/components/ListItem'
import EventPlaceholder1 from '../assets/EventPlaceholder1.jpg'
import EventPlaceholder2 from '../assets/EventPlaceholder2.jpg'
import EventPlaceholder3 from '../assets/EventPlaceholder3.jpg'
import RemoteContent from '../../../modules/common/components/RemoteContent'

const EXCERPT_LENGTH = 70

type PropsType = {|
  event: EventModel,
  language: string,
  onInternalLinkClick: string => void
|}

class EventListItem extends React.PureComponent<PropsType> {
  /**
   * We have three placeholder thumbnails to display when cities don't provide a thumbnail
   * @returns {*} The Placeholder Thumbnail
   */
  getEventPlaceholder (id: number): string {
    const placeholders = [EventPlaceholder1, EventPlaceholder2, EventPlaceholder3]
    return placeholders[id % placeholders.length]
  }

  formatExcerpt (excerptLength: number): string {
    return `${this.props.event.excerpt.slice(0, excerptLength)}...`
  }

  render () {
    const {event, language, onInternalLinkClick} = this.props
    return (
      <ListItem thumbnail={event.thumbnail || this.getEventPlaceholder(event.id)}
                title={event.title}
                path={event.path}>
          <div>
            {event.date && <div>{event.date.toFormattedString(language)}</div>}
            <div>{event.location.location}</div>
          </div>
          <RemoteContent dangerouslySetInnerHTML={{__html: this.formatExcerpt(EXCERPT_LENGTH)}}
                         onInternLinkClick={onInternalLinkClick} />
      </ListItem>
    )
  }
}

export default EventListItem
