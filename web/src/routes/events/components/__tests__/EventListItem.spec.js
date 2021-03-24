// @flow

import React from 'react'
import { EventModel, LocationModel, DateModel } from 'api-client'
import moment from 'moment'
import { shallow } from 'enzyme'
import EventListItem from '../EventListItem'
import DateFormatter from 'api-client/src/i18n/DateFormatter'

describe('EventListItem', () => {
  const language = 'de'

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

  // TODO IGAPP-399: Reactivate test
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should render and match snapshot', () => {
    expect(shallow(<EventListItem event={event} formatter={new DateFormatter(language)} />)).toMatchSnapshot()
  })
})
