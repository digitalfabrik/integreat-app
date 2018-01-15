import React from 'react'
import { shallow } from 'enzyme'
import moment from 'moment-timezone'

import EventModel from 'modules/endpoint/models/EventModel'
import EventDetail from '../EventDetail'

describe('EventDetail', () => {
  // we need UTC here, see https://medium.com/front-end-hacking/jest-snapshot-testing-with-dates-and-times-f3badb8f1d87
  // otherwise snapshot testing is not working
  moment.tz.setDefault('UTC')

  const event = new EventModel({
    id: 1234,
    title: 'first Event',
    availableLanguages: {de: '1235', ar: '1236'},
    startDate: moment('2017-11-18 09:30:00'),
    endDate: moment('2017-11-18 19:30:00'),
    allDay: true
  })

  const language = 'en'

  test('should render', () => {
    expect(shallow(<EventDetail event={event} language={language} />)).toMatchSnapshot()
  })
})
