// @flow

import React from 'react'
import { CategoryTimeStamp } from '../CategoryTimeStamp'
import { shallow } from 'enzyme'
import moment from 'moment-timezone'

describe('CategoryTimeStamp', () => {
  const t = (key: ?string): string => key || ''

  it('should match snapshot', () => {
    const lastUpdate = moment.tz('2017-11-18 19:30:00', 'UTC')
    expect(shallow(
      <CategoryTimeStamp lastUpdate={lastUpdate} language={'de'} t={t} />
    )).toMatchSnapshot()
  })
})
