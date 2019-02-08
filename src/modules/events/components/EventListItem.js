// @flow

import * as React from 'react'
import { View } from 'react-native'
import styled from 'styled-components'
import { EventModel } from '@integreat-app/integreat-api-client'
import ListItem from '../../../modules/common/components/ListItem'
import EventPlaceholder1 from '../assets/EventPlaceholder1.jpg'
import EventPlaceholder2 from '../assets/EventPlaceholder2.jpg'
import EventPlaceholder3 from '../assets/EventPlaceholder3.jpg'

const WrappedText = styled.Text`
`

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

  render () {
    const {event, language, navigateToEvent} = this.props
    return (
      <ListItem thumbnail={event.thumbnail || this.getEventPlaceholder(event.id)}
                title={event.title}
                navigateTo={navigateToEvent}>
        <View>
          <WrappedText>{event.date.toFormattedString(language)}</WrappedText>
          <WrappedText>{event.location.location}</WrappedText>
        </View>
      </ListItem>
    )
  }
}

export default EventListItem
