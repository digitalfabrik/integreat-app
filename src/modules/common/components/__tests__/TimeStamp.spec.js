import React from 'react'
import { TimeStamp } from '../TimeStamp'
import { shallow } from 'enzyme'
import moment from 'moment-timezone'

describe('TimeStamp', () => {
  it('should match snapshot', () => {
    const lastUpdate = moment.tz('2017-11-18 19:30:00', 'UTC')
    expect(shallow(
      <TimeStamp lastUpdate={lastUpdate} language={'de'} t={key => key} />
    )).toMatchSnapshot()
  })
})
