import React from 'react'
import { shallow } from 'enzyme'
import moment from 'moment/moment'

import EventModel from 'modules/endpoint/models/EventModel'
import EventListElement from '../EventListElement'

describe('EventListElement', () => {
  const event = new EventModel({
    id: 1234,
    title: 'first Event',
    availableLanguages: {de: '1235', ar: '1236'},
    startDate: moment('2017-11-27 19:30:00'),
    endDate: moment('2017-11-27 21:30:00'),
    allDay: false
  })

  const url = `/augsburg/en/events`

  const language = 'en'

  test('should render', () => {
    expect(shallow(
      <EventListElement event={event} parentUrl={url} isFirst={false} language={language} />
    )).toMatchSnapshot()
  })
})
