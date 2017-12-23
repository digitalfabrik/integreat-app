import React from 'react'
import { shallow } from 'enzyme'

import EventModel from 'modules/endpoint/models/EventModel'
import EventDetail from '../EventDetail'

describe('EventDetail', () => {
  const event = new EventModel({
    id: 1234,
    title: 'first Event',
    availableLanguages: {de: '1235', ar: '1236'}
  })

  const language = 'en'

  test('should render', () => {
    expect(shallow(<EventDetail event={event} language={language} />)).toMatchSnapshot()
  })

  test('should have thumbnail', () => {
    const eventDetail = shallow(<EventDetail event={event} language={language} />).instance()
    expect(eventDetail.find('.thumbnail')).toHaveLength(1)
  })
})
