import React from 'react'
import { shallow } from 'enzyme'

import EventModel from 'modules/endpoint/models/EventModel'
import EventDetail from '../EventDetail'

describe('EventDetail', () => {
  const event = new EventModel({
    id: 1234,
    title: 'first Event',
    availableLanguages: {de: '1235', ar: '1236'},
    startDate: new Date('2017-11-18 09:30:00'),
    endDate: new Date('2017-11-18 19:30:00'),
    allDay: true
  })

  const language = 'en'

  test('should render', () => {
    expect(shallow(<EventDetail event={event} language={language} />)).toMatchSnapshot()
  })
})
