// @flow

import React from 'react'
import { shallow } from 'enzyme'
import moment from 'moment-timezone'

import { PageDetail } from '../PageDetail'
import DateModel from '../../../endpoint/models/DateModel'
import LocationModel from '../../../endpoint/models/LocationModel'

describe('EventDetail', () => {
  const title = 'first Event'
  const date = new DateModel({
    startDate: moment.tz('2017-11-18 09:30:00', 'UTC'),
    endDate: moment.tz('2017-11-18 19:30:00', 'UTC'),
    allDay: true
  })
  const location = new LocationModel({
    address: 'address',
    town: 'town',
    postcode: 'postcode'
  })
  const lastUpdate = moment('2016-01-07 10:36:24')
  const content = 'content'
  const thumbnail = 'thumbnail'

  const language = 'en'

  const t = (key: ?string): string => key || ''

  it('should render', () => {
    expect(shallow(<PageDetail title={title}
                               date={date}
                               location={location}
                               lastUpdate={lastUpdate}
                               content={content}
                               thumbnail={thumbnail}
                               language={language}
                               onInternalLinkClick={() => {}}
                               t={t} />
    )).toMatchSnapshot()
  })
})
