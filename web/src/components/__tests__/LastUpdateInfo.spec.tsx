import { shallow } from 'enzyme'
import React from 'react'

import moment from 'moment'

import DateFormatter from 'api-client/src/i18n/DateFormatter'

import { LastUpdateInfo } from '../LastUpdateInfo'

describe('LastUpdateInfo', () => {
  const t = (key: string) => key

  it('should match snapshot', () => {
    const lastUpdate = moment('2017-11-18T09:30:00.000Z')
    expect(
      shallow(<LastUpdateInfo lastUpdate={lastUpdate} formatter={new DateFormatter('de')} t={t} withText={false} />)
    ).toMatchSnapshot()
  })
})
