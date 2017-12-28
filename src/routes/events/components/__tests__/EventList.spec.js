import React from 'react'
import { shallow } from 'enzyme'

import EventModel from 'modules/endpoint/models/EventModel'
import EventList from '../EventList'
import DateModel from '../../../../modules/endpoint/models/DateModel'

describe('EventList', () => {
  const events = [
    new EventModel({
      id: 1234,
      title: 'first Event',
      availableLanguages: {de: '1235', ar: '1236'},
      date: new DateModel({startDate: new Date('2017-11-18' + 'T' + '09:30:00' + 'Z'),
        endDate: new Date('2017-11-18' + 'T' + '19:30:00' + 'Z'),
        allDay: true
      })
    }),
    new EventModel({
      id: 1235,
      title: 'erstes Event',
      availableLanguages: {en: '1234', ar: '1236'},
      date: new DateModel({startDate: new Date('2017-11-18' + 'T' + '09:30:00' + 'Z'),
        endDate: new Date('2017-11-18' + 'T' + '19:30:00' + 'Z'),
        allDay: true
      })
    }),
    new EventModel({
      id: 2,
      title: 'second Event',
      date: new DateModel({startDate: new Date('2017-11-18' + 'T' + '09:30:00' + 'Z'),
        endDate: new Date('2017-11-18' + 'T' + '19:30:00' + 'Z'),
        allDay: true
      })
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
