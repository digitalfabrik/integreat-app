import React from 'react'
import { shallow } from 'enzyme'
import moment from 'moment-timezone'

import EventDetail from '../EventDetail'

describe('EventDetail', () => {
  const event = {
    id: 1234,
    title: 'first Event',
    availableLanguages: {de: '1235', ar: '1236'},
    startDate: moment.tz('2017-11-18 09:30:00', 'UTC'),
    endDate: moment.tz('2017-11-18 19:30:00', 'UTC'),
    allDay: true
  }

  const language = 'en'

  it('should render', () => {
    expect(shallow(<EventDetail event={event} language={language} />)).toMatchSnapshot()
  })
})
