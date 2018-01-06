import React from 'react'
import { shallow } from 'enzyme'
import moment from 'moment'

import EventModel from 'modules/endpoint/models/EventModel'
import EventList from '../EventList'

describe('EventList', () => {
  const events = [
    new EventModel({
      id: 1234,
      title: 'first Event',
      availableLanguages: {de: '1235', ar: '1236'},
      startDate: moment('2017-11-18 09:30:00'),
      endDate: moment('2017-11-18 19:30:00'),
      allDay: true
    }),
    new EventModel({
      id: 1235,
      title: 'erstes Event',
      availableLanguages: {en: '1234', ar: '1236'},
      startDate: moment('2017-11-18 09:30:00'),
      endDate: moment('2017-11-18 19:30:00'),
      allDay: true
    }),
    new EventModel({
      id: 2,
      title: 'second Event',
      startDate: moment('2017-11-18 09:30:00'),
      endDate: moment('2017-11-18 19:30:00'),
      allDay: true
    })
  ]

  const url = `/augsburg/en/events`

  const language = 'en'

  test('should render a list of events', () => {
    expect(shallow(<EventList events={events} language={language} url={url} />).dive()).toMatchSnapshot()
  })

  test('should render no events', () => {
    expect(shallow(<EventList events={[]} language={language} url={url} />).dive()).toMatchSnapshot()
  })
})
