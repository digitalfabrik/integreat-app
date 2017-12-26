import React from 'react'
import { shallow } from 'enzyme'

import EventModel from 'modules/endpoint/models/EventModel'
import EventDetail from '../EventDetail'
import DateModel from '../../../../modules/endpoint/models/DateModel'

describe('EventDetail', () => {
  const event = new EventModel({
    id: 1234,
    title: 'first Event',
    availableLanguages: {de: '1235', ar: '1236'},
    date: new DateModel({startDate: new Date('2017-11-18' + 'T' + '09:30:00' + 'Z'),
      endDate: new Date('2017-11-18' + 'T' + '19:30:00' + 'Z'),
      allDay: true
    })
  })

  const language = 'en'

  test('should render', () => {
    expect(shallow(<EventDetail event={event} language={language} />)).toMatchSnapshot()
  })
})
