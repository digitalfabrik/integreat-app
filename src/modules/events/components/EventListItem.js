// @flow

import * as React from 'react'
import { View, Text } from 'react-native'
import { EventModel } from '@integreat-app/integreat-api-client'
import ListItem from '../../../modules/common/components/ListItem'
import EventPlaceholder1 from '../assets/EventPlaceholder1.jpg'
import EventPlaceholder2 from '../assets/EventPlaceholder2.jpg'
import EventPlaceholder3 from '../assets/EventPlaceholder3.jpg'

const EXCERPT_LENGTH = 70

type PropsType = {|
  event: EventModel,
  language: string,
  navigateToEvent: () => void
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

  static formatExcerpt (excerpt: string): string {
    return `${excerpt.slice(0, EXCERPT_LENGTH)}...`
  }

  render () {
    const {event, language, navigateToEvent} = this.props
    return (
      <ListItem thumbnail={event.thumbnail || this.getEventPlaceholder(event.id)}
                title={event.title}
                navigateTo={navigateToEvent}>
        <View>
          <Text>{event.date.toFormattedString(language)}</Text>
          <Text>{event.location.location}</Text>
        </View>
        <Text>{EventListItem.formatExcerpt(event.excerpt)}</Text>
      </ListItem>
    )
  }
}

export default EventListItem
