// @flow

import * as React from 'react'
import { EventModel } from 'api-client'
import ListItem from '../../../modules/common/components/ListItem'
import EventPlaceholder1 from '../assets/EventPlaceholder1.jpg'
import EventPlaceholder2 from '../assets/EventPlaceholder2.jpg'
import EventPlaceholder3 from '../assets/EventPlaceholder3.jpg'
import styled from 'styled-components/native'
import type { ThemeType } from '../../../modules/theme/constants'

type PropsType = {|
  event: EventModel,
  language: string,
  navigateToEvent: () => void,
  theme: ThemeType
|}

const Description = styled.Text`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.contentFontRegular};
`

class EventListItem extends React.PureComponent<PropsType> {
  /**
   * We have three placeholder thumbnails to display when cities don't provide a thumbnail
   * @returns {*} The Placeholder Thumbnail
   */
  getEventPlaceholder (id: number): number {
    const placeholders = [EventPlaceholder1, EventPlaceholder2, EventPlaceholder3]
    return placeholders[id % placeholders.length]
  }

  render () {
    const { event, language, navigateToEvent, theme } = this.props
    const thumbnail = event.thumbnail || this.getEventPlaceholder(event.path.length)
    return (
      <ListItem thumbnail={thumbnail}
                title={event.title}
                language={language}
                navigateTo={navigateToEvent}
                theme={theme}>
        <Description theme={theme}>{event.date.toFormattedString(language)}</Description>
        {event.location.location && <Description theme={theme}>{event.location.location}</Description>}
      </ListItem>
    )
  }
}

export default EventListItem
