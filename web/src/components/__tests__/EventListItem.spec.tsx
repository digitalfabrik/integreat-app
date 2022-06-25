import moment from 'moment'
import React from 'react'
import { ThemeProvider } from 'styled-components'

import { DateFormatter, DateModel, EventModel, LocationModel } from 'api-client'

import EventPlaceholder1 from '../../assets/EventPlaceholder1.jpg'
import EventPlaceholder2 from '../../assets/EventPlaceholder2.jpg'
import EventPlaceholder3 from '../../assets/EventPlaceholder3.jpg'
import buildConfig from '../../constants/buildConfig'
import { renderWithRouter } from '../../testing/render'
import { textTruncator } from '../../utils/stringUtils'
import EventListItem, { NUM_OF_CHARS_ALLOWED } from '../EventListItem'

describe('EventListItem', () => {
  const language = 'de'
  const theme = buildConfig().lightTheme

  const event = new EventModel({
    path: '/augsburg/en/events/first_event',
    title: 'first Event',
    availableLanguages: new Map([
      ['de', '/augsburg/de/events/erstes_event'],
      ['ar', '/augsburg/ar/events/erstes_event']
    ]),
    date: new DateModel({
      startDate: moment('2017-11-18T09:30:00.000Z'),
      endDate: moment('2017-11-18T19:30:00.000Z'),
      allDay: true
    }),
    location: new LocationModel({
      id: 1,
      name: 'name',
      address: 'address',
      town: 'town',
      postcode: 'postcode',
      longitude: null,
      latitude: null,
      country: 'country'
    }),
    excerpt: 'very loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong excerpt',
    lastUpdate: moment('2016-01-07 10:36:24'),
    content: 'content',
    thumbnail: 'https://cms.integreat-app/03/Hotline-150x150.png',
    hash: '2fe6283485a93932',
    featuredImage: null
  })

  it('should show event list item with specific thumbnail', () => {
    const formatter = new DateFormatter(language)
    const { getByText, getByRole } = renderWithRouter(
      <ThemeProvider theme={theme}>
        <EventListItem event={event} formatter={formatter} />
      </ThemeProvider>
    )

    expect(getByText(event.title)).toBeTruthy()
    expect(getByText(event.date.toFormattedString(formatter))).toBeTruthy()
    expect(getByText(event.location.fullAddress)).toBeTruthy()
    expect(getByRole('img')).toHaveProperty('src', event.thumbnail)
    expect(getByText(textTruncator(event.excerpt, NUM_OF_CHARS_ALLOWED))).toBeTruthy()
  })

  it('should show event list item with placeholder thumbnail', () => {
    const eventWithoutThumbnail = Object.assign(event, { _thumbnail: undefined })
    const formatter = new DateFormatter(language)
    const { getByText, getByRole } = renderWithRouter(
      <ThemeProvider theme={theme}>
        <EventListItem event={eventWithoutThumbnail} formatter={formatter} />
      </ThemeProvider>
    )

    expect(getByText(event.title)).toBeTruthy()
    expect(getByText(event.date.toFormattedString(formatter))).toBeTruthy()
    const src = (getByRole('img') as HTMLMediaElement).src
    expect([EventPlaceholder1, EventPlaceholder2, EventPlaceholder3].some(img => src.endsWith(img))).toBeTruthy()
    expect(getByText(textTruncator(event.excerpt, NUM_OF_CHARS_ALLOWED))).toBeTruthy()
  })
})
