// @flow

import React from 'react'
import EventModel from '../../../../modules/endpoint/models/EventModel'
import LocationModel from '../../../../modules/endpoint/models/LocationModel'
import DateModel from '../../../../modules/endpoint/models/DateModel'
import moment from 'moment-timezone'
import { shallow } from 'enzyme'
import EventListItem from '../EventListItem'

describe('EventListItem', () => {
  const onInternalLinkClick = (link: string) => {}
  const language = 'de'

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
    excerpt: 'very loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong excerpt',
    lastUpdate: moment('2016-01-07 10:36:24'),
    content: 'content',
    thumbnail: 'thumbnail'
  })

  it('should render and match snapshot', () => {
    expect(shallow(
      <EventListItem event={event} language={language} onInternalLinkClick={onInternalLinkClick} />
    )).toMatchSnapshot()
  })
})
