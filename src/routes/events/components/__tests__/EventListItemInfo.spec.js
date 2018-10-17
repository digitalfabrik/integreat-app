// @flow

import React from 'react'
import DateModel from '../../../../modules/endpoint/models/DateModel'
import moment from 'moment'
import LocationModel from '../../../../modules/endpoint/models/LocationModel'
import { shallow } from 'enzyme'
import EventListItemInfo from '../EventListItemInfo'

describe('EventListItemInfo', () => {
  it('should render and match snapshot', () => {
    const date = new DateModel({
      startDate: moment('2017-11-27 19:30:00'),
      endDate: moment('2017-11-28 21:30:00'),
      allDay: false
    })
    const location = new LocationModel({
      address: 'address',
      town: 'town',
      postcode: '11111'
    })
    const excerpt = 'very looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong excerpt'
    const onInternalLinkClick = () => {}

    expect(shallow(
      <EventListItemInfo location={location} date={date} excerpt={excerpt} language={'de'}
                         onInternalLinkClick={onInternalLinkClick} />
    )).toMatchSnapshot()
  })
})
