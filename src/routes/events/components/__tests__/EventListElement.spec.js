import React from 'react'
import { shallow } from 'enzyme'
import moment from 'moment-timezone'

import EventModel from 'modules/endpoint/models/EventModel'
import EventListElement from '../EventListElement'

describe('EventListElement', () => {
  const event = new EventModel({
    id: 1234,
    title: 'first Event',
    availableLanguages: {de: '1235', ar: '1236'},
    startDate: moment.tz('2017-11-27 19:30:00', 'UTC'),
    endDate: moment.tz('2017-11-27 21:30:00', 'UTC'),
    allDay: false
  })

  const url = `/augsburg/en/events`

  const language = 'en'

  it('should render', () => {
    expect(shallow(
      <EventListElement event={event} parentUrl={url} isFirst={false} language={language} />
    )).toMatchSnapshot()
  })
})
