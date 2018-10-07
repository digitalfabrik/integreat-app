// @flow

import React from 'react'
import { shallow } from 'enzyme'
import moment from 'moment-timezone'

import EventModel from 'modules/endpoint/models/EventModel'
import EventList from '../EventList'

describe('EventList', () => {
  const events = [
    new EventModel({
      id: 1,
      path: '/augsburg/en/events/first_event',
      title: 'first Event',
      availableLanguages: new Map(
        [['de', '/augsburg/de/events/erstes_event'], ['ar', '/augsburg/ar/events/erstes_event']]),
      startDate: moment.tz('2017-11-18 09:30:00', 'UTC'),
      endDate: moment.tz('2017-11-18 19:30:00', 'UTC'),
      allDay: true,
      address: 'address',
      content: 'content',
      excerpt: 'excerpt',
      thumbnail: 'thumbnail',
      town: 'town'
    }),
    new EventModel({
      id: 2,
      path: '/augsburg/en/events/second_event',
      title: 'second Event',
      availableLanguages: new Map(
        [['en', '/augsburg/de/events/zwotes_event'], ['ar', '/augsburg/ar/events/zwotes_event']]),
      startDate: moment.tz('2017-11-18 09:30:00', 'UTC'),
      endDate: moment.tz('2017-11-18 19:30:00', 'UTC'),
      allDay: true,
      address: 'address',
      content: 'content',
      excerpt: 'excerpt',
      thumbnail: 'thumbnail',
      town: 'town'
    }),
    new EventModel({
      id: 3,
      path: '/augsburg/en/events/third_event',
      title: 'third Event',
      availableLanguages: new Map(
        [['de', '/augsburg/de/events/drittes_event'], ['ar', '/augsburg/ar/events/erstes_event']]),
      startDate: moment.tz('2017-11-18 09:30:00', 'UTC'),
      endDate: moment.tz('2017-11-18 19:30:00', 'UTC'),
      allDay: true,
      address: 'address',
      content: 'content',
      excerpt: 'excerpt',
      thumbnail: 'thumbnail',
      town: 'town'
    })
  ]

  const city = 'augsburg'

  const language = 'en'

  it('should render a list of events', () => {
    expect(shallow(<EventList events={events} language={language} city={city}
                              onInternalLinkClick={() => {}} />).dive()).toMatchSnapshot()
  })

  it('should render no events', () => {
    expect(shallow(<EventList events={[]} language={language} city={city}
                              onInternalLinkClick={() => {}} />).dive()).toMatchSnapshot()
  })
})
