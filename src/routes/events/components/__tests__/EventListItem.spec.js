// @flow

import React from 'react'
import { EventModel, LocationModel, DateModel } from '@integreat-app/integreat-api-client'
import moment from 'moment'
import { shallow } from 'enzyme'
import EventListItem from '../EventListItem'

describe('EventListItem', () => {
  const language = 'de'

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
      address: 'address',
      town: 'town',
      postcode: 'postcode'
    }),
    excerpt: 'very loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong excerpt',
    lastUpdate: moment('2016-01-07 10:36:24'),
    content: 'content',
    thumbnail: 'thumbnail',
    hash: '2fe6283485a93932'
  })

  it('should render and match snapshot', () => {
    expect(shallow(
      <EventListItem event={event} language={language} />
    )).toMatchSnapshot()
  })
})
