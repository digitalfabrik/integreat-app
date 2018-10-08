// @flow

import React from 'react'
import { shallow } from 'enzyme'
import moment from 'moment-timezone'

import EventListElement from '../EventListElement'
import EventModel from '../../../../modules/endpoint/models/EventModel'

describe('EventListElement', () => {
  const event = new EventModel({
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
  })

  const language = 'en'
  const noop = () => {}

  it('should render', () => {
    expect(shallow(
      <EventListElement event={event} language={language} onInternalLinkClick={noop} />
    )).toMatchSnapshot()
  })
})
