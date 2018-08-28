// @flow

import React from 'react'
import { shallow } from 'enzyme'
import moment from 'moment-timezone'

import EventListElement from '../EventListElement'
import EventModel from '../../../../modules/endpoint/models/EventModel'

describe('EventListElement', () => {
  const event = new EventModel({
    id: 1234,
    title: 'first Event',
    availableLanguages: new Map([['de', 1235], ['ar', 1236]]),
    startDate: moment.tz('2017-11-18 09:30:00', 'UTC'),
    endDate: moment.tz('2017-11-18 19:30:00', 'UTC'),
    allDay: true,
    address: 'address',
    content: 'content',
    excerpt: 'excerpt',
    thumbnail: 'thumbnail',
    town: 'town'
  })

  const city = 'augsburg'
  const language = 'en'

  it('should render', () => {
    expect(shallow(
      <EventListElement event={event} city={city} language={language} />
    )).toMatchSnapshot()
  })
})
