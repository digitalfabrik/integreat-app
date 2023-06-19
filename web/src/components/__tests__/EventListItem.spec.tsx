import React from 'react'

import { DateFormatter, EventModelBuilder, getExcerpt } from 'api-client'

import EventPlaceholder1 from '../../assets/EventPlaceholder1.jpg'
import EventPlaceholder2 from '../../assets/EventPlaceholder2.jpg'
import EventPlaceholder3 from '../../assets/EventPlaceholder3.jpg'
import { EXCERPT_MAX_CHARS } from '../../constants'
import { renderWithRouterAndTheme } from '../../testing/render'
import EventListItem from '../EventListItem'

describe('EventListItem', () => {
  const language = 'de'

  const event = new EventModelBuilder('seed', 1, 'augsburg', language).build()[0]!
  const formatter = new DateFormatter(language)
  const excerpt = getExcerpt(event.excerpt, { maxChars: EXCERPT_MAX_CHARS })

  it('should show event list item with specific thumbnail', () => {
    const { getByText, getByRole } = renderWithRouterAndTheme(<EventListItem event={event} formatter={formatter} />)

    expect(getByText(event.title)).toBeTruthy()
    expect(getByText('Mar 6, 2019, 11:04 PM - Jan 1, 2015, 4:10 AM')).toBeInTheDocument()
    expect(getByText(event.location!.fullAddress)).toBeTruthy()
    expect(getByRole('img')).toHaveProperty('src', event.thumbnail)
    expect(getByText(excerpt)).toBeTruthy()
  })

  it('should show event list item with placeholder thumbnail', () => {
    const eventWithoutThumbnail = Object.assign(event, { _thumbnail: undefined })

    const { getByText, getByRole } = renderWithRouterAndTheme(
      <EventListItem event={eventWithoutThumbnail} formatter={formatter} />
    )

    expect(getByText(event.title)).toBeTruthy()
    expect(getByText('Mar 6, 2019, 11:04 PM - Jan 1, 2015, 4:10 AM')).toBeInTheDocument()
    const src = (getByRole('img') as HTMLMediaElement).src
    expect([EventPlaceholder1, EventPlaceholder2, EventPlaceholder3].some(img => src.endsWith(img))).toBeTruthy()
    expect(getByText(excerpt)).toBeTruthy()
  })
})
