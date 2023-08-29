import React from 'react'

import { EventModelBuilder, getExcerpt } from 'api-client'

import { EventThumbnailPlaceholder1, EventThumbnailPlaceholder2, EventThumbnailPlaceholder3 } from '../../assets'
import { EXCERPT_MAX_CHARS } from '../../constants'
import { renderWithRouterAndTheme } from '../../testing/render'
import EventListItem from '../EventListItem'

describe('EventListItem', () => {
  const language = 'de'

  const event = new EventModelBuilder('seed', 1, 'augsburg', language).build()[0]!
  const excerpt = getExcerpt(event.excerpt, { maxChars: EXCERPT_MAX_CHARS })

  it('should show event list item with specific thumbnail', () => {
    const { getByText, getByRole } = renderWithRouterAndTheme(<EventListItem event={event} languageCode={language} />)

    expect(getByText(event.title)).toBeTruthy()
    expect(getByText(event.date.toFormattedString(language), { collapseWhitespace: false })).toBeTruthy()
    expect(getByText(event.location!.fullAddress)).toBeTruthy()
    expect(getByRole('img')).toHaveProperty('src', event.thumbnail)
    expect(getByText(excerpt)).toBeTruthy()
  })

  it('should show event list item with placeholder thumbnail', () => {
    const eventWithoutThumbnail = Object.assign(event, { _thumbnail: undefined })

    const { getByText, getByRole } = renderWithRouterAndTheme(
      <EventListItem event={eventWithoutThumbnail} languageCode={language} />,
    )

    expect(getByText(event.title)).toBeTruthy()
    expect(getByText(event.date.toFormattedString(language), { collapseWhitespace: false })).toBeTruthy()
    const src = (getByRole('img') as HTMLMediaElement).src
    expect(
      [EventThumbnailPlaceholder1, EventThumbnailPlaceholder2, EventThumbnailPlaceholder3].some(img =>
        src.endsWith(img),
      ),
    ).toBeTruthy()
    expect(getByText(excerpt)).toBeTruthy()
  })
})
