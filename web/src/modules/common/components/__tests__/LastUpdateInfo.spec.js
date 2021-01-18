// @flow

import React from 'react'
import { LastUpdateInfo } from '../LastUpdateInfo'
import { shallow } from 'enzyme'
import moment from 'moment'
import DateFormatter from 'api-client/src/i18n/DateFormatter'

describe('LastUpdateInfo', () => {
  const t = (key: ?string): string => key || ''

  it('should match snapshot', () => {
    const lastUpdate = moment('2017-11-18T09:30:00.000Z')
    expect(shallow(
      <LastUpdateInfo lastUpdate={lastUpdate} formatter={new DateFormatter(undefined, 'de')} t={t} withText={false} />
    )).toMatchSnapshot()
  })
})
