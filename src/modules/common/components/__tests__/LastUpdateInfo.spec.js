// @flow

import React from 'react'
import { LastUpdateInfo } from '../LastUpdateInfo'
import { shallow } from 'enzyme'
import moment from 'moment'

describe('LastUpdateInfo', () => {
  const t = (key: ?string): string => key || ''

  it('should match snapshot', () => {
    const lastUpdate = moment('2017-11-18T09:30:00.000Z')
    expect(shallow(
      <LastUpdateInfo lastUpdate={lastUpdate} language='de' t={t} />
    )).toMatchSnapshot()
  })
})
