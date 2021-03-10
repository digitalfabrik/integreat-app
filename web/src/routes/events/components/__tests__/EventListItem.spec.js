// @flow

import React from 'react'
import { EventModel, LocationModel, DateModel } from 'api-client'
import moment from 'moment'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import { render } from '@testing-library/react'
import EventListItem, { NUM_WORDS_ALLOWED } from '../EventListItem'
import DateFormatter from 'api-client/src/i18n/DateFormatter'
import textTruncator from '../../../../modules/common/utils/textTruncator'
import { ThemeProvider } from 'styled-components'
import theme from '../../../../modules/theme/constants/theme'
import createLocation from '../../../../createLocation'
import { EVENTS_ROUTE } from '../../../../modules/app/route-configs/EventsRouteConfig'
import CityModelBuilder from 'api-client/src/testing/CityModelBuilder'

describe('EventListItem', () => {
  const language = 'de'
  const cities = new CityModelBuilder(2).build()

  const event = new EventModel({
    path: '/augsburg/en/events/first_event',
    title: 'first Event',
    availableLanguages: new Map(
      [['de', '/augsburg/de/events/erstes_event'], ['ar', '/augsburg/ar/events/erstes_event']]),
    date: new DateModel({
      startDate: moment('2017-11-18T09:30:00.000Z'),
      endDate: moment('2017-11-18T19:30:00.000Z'),
      allDay: true
    }),
    location: new LocationModel({
      name: 'name',
      address: 'address',
      town: 'town',
      postcode: 'postcode',
      longitude: null,
      latitude: null,
      state: 'state',
      region: 'region',
      country: 'country'
    }),
    excerpt: 'very loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong excerpt',
    lastUpdate: moment('2016-01-07 10:36:24'),
    content: 'content',
    thumbnail: 'thumbnail',
    hash: '2fe6283485a93932',
    featuredImage: null
  })

  it('should ', () => {
    const location = createLocation({
      payload: { city: 'augsburg', language: language },
      pathname: '/augsburg/de/events/erstes_event',
      type: EVENTS_ROUTE
    })
    const formatter = new DateFormatter(language)
    const mockStore = configureMockStore()
    const store = mockStore({
      location: location,
      cities: { data: cities, isFetching: false },
      theme: theme
    })
    const { getByText } = render(
      <ThemeProvider theme={theme} >
        <EventListItem event={event} formatter={formatter} />
      </ThemeProvider>)
    expect(getByText(event.title)).toBeTruthy()
    expect(getByText(event.date.toFormattedString(formatter))).toBeTruthy()
    expect(getByText(event.location.location)).toBeTruthy()
    expect(getByText(textTruncator(event.excerpt, NUM_WORDS_ALLOWED))).toBeTruthy()
  })
})
