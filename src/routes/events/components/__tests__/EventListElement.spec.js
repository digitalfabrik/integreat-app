// @flow

import React from 'react'
import { shallow } from 'enzyme'
import moment from 'moment-timezone'

import EventListElement from '../EventListElement'
import EventModel from '../../../../modules/endpoint/models/EventModel'
import DateModel from '../../../../modules/endpoint/models/DateModel'
import LocationModel from '../../../../modules/endpoint/models/LocationModel'

describe('EventListElement', () => {
  const event = new EventModel({
    id: 1,
    path: '/augsburg/en/events/first_event',
    title: 'first Event',
    availableLanguages: new Map(
      [['de', '/augsburg/de/events/erstes_event'], ['ar', '/augsburg/ar/events/erstes_event']]),
    date: new DateModel({
      startDate: moment.tz('2017-11-18 09:30:00', 'UTC'),
      endDate: moment.tz('2017-11-18 19:30:00', 'UTC'),
      allDay: true
    }),
    location: new LocationModel({
      address: 'address',
      town: 'town',
      postcode: 'postcode'
    }),
    excerpt: 'excerpt',
    lastUpdate: moment('2016-01-07 10:36:24'),
    content: 'content',
    thumbnail: 'thumbnail'
  })

  const language = 'en'
  const noop = () => {}

  it('should render', () => {
    expect(shallow(
      <EventListElement event={event} language={language} onInternalLinkClick={noop} />
    )).toMatchSnapshot()
  })
})
