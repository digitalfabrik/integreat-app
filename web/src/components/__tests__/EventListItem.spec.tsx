import React from 'react'

import { DateFormatter, EventModelBuilder } from 'api-client'

import EventPlaceholder1 from '../../assets/EventPlaceholder1.jpg'
import EventPlaceholder2 from '../../assets/EventPlaceholder2.jpg'
import EventPlaceholder3 from '../../assets/EventPlaceholder3.jpg'
import { renderWithRouter } from '../../testing/render'
import { textTruncator } from '../../utils/stringUtils'
import EventListItem, { NUM_OF_CHARS_ALLOWED } from '../EventListItem'

describe('EventListItem', () => {
  const language = 'de'

  const event = new EventModelBuilder('seed', 1, 'augsburg', language).build()[0]!
  const formatter = new DateFormatter(language)

  it('should show event list item with specific thumbnail', () => {
    const { getByText, getByRole } = renderWithRouter(<EventListItem event={event} formatter={formatter} />, {
      wrapWithTheme: true,
    })

    expect(getByText(event.title)).toBeTruthy()
    expect(getByText(event.date.toFormattedString(formatter))).toBeTruthy()
    expect(getByText(event.location!.fullAddress)).toBeTruthy()
    expect(getByRole('img')).toHaveProperty('src', event.thumbnail)
    expect(getByText(textTruncator(event.excerpt, NUM_OF_CHARS_ALLOWED))).toBeTruthy()
  })

  it('should show event list item with placeholder thumbnail', () => {
    const eventWithoutThumbnail = Object.assign(event, { _thumbnail: undefined })

    const { getByText, getByRole } = renderWithRouter(
      <EventListItem event={eventWithoutThumbnail} formatter={formatter} />,
      { wrapWithTheme: true }
    )

    expect(getByText(event.title)).toBeTruthy()
    expect(getByText(event.date.toFormattedString(formatter))).toBeTruthy()
    const src = (getByRole('img') as HTMLMediaElement).src
    expect([EventPlaceholder1, EventPlaceholder2, EventPlaceholder3].some(img => src.endsWith(img))).toBeTruthy()
    expect(getByText(textTruncator(event.excerpt, NUM_OF_CHARS_ALLOWED))).toBeTruthy()
  })
})
