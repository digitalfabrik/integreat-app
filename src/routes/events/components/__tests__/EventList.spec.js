import React from 'react'
import { shallow } from 'enzyme'
import moment from 'moment-timezone'

import EventList from '../EventList'

describe('EventList', () => {
  const events = [
    {
      id: 1234,
      title: 'first Event',
      availableLanguages: {de: '1235', ar: '1236'},
      startDate: moment.tz('2017-11-18 09:30:00', 'UTC'),
      endDate: moment.tz('2017-11-18 19:30:00', 'UTC'),
      allDay: true
    },
    {
      id: 1235,
      title: 'erstes Event',
      availableLanguages: {en: '1234', ar: '1236'},
      startDate: moment.tz('2017-11-18 09:30:00', 'UTC'),
      endDate: moment.tz('2017-11-18 19:30:00', 'UTC'),
      allDay: true
    },
    {
      id: 2,
      title: 'second Event',
      startDate: moment.tz('2017-11-18 09:30:00', 'UTC'),
      endDate: moment.tz('2017-11-18 19:30:00', 'UTC'),
      allDay: true
    }
  ]

  const url = `/augsburg/en/events`

  const language = 'en'

  it('should render a list of events', () => {
    expect(shallow(<EventList events={events} language={language} url={url} />).dive()).toMatchSnapshot()
  })

  it('should render no events', () => {
    expect(shallow(<EventList events={[]} language={language} url={url} />).dive()).toMatchSnapshot()
  })
})
