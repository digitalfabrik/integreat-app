// @flow

import React from 'react'
import { LastUpdateInfo } from '../LastUpdateInfo'
import { shallow } from 'enzyme'
import moment from 'moment-timezone'

describe('LastUpdateInfo', () => {
  const t = (key: ?string): string => key || ''

  it('should match snapshot', () => {
    const lastUpdate = moment.tz('2017-11-18 19:30:00', 'UTC')
    expect(shallow(
      <LastUpdateInfo lastUpdate={lastUpdate} language='de' t={t} />
    )).toMatchSnapshot()
  })
})
