// @flow

import React from 'react'
import { shallow } from 'enzyme'
import Tab from '../Tab'

describe('Tab', () => {
  const TU_NEWS = 'tu'
  const type = TU_NEWS
  const active = true
  const destination = '/testcity/en/news/local'
  const t = (key: ?string): string => key || ''

  it('should render and match snapshot', () => {
    expect(shallow(
      <Tab
        type={type}
        active={active}
        destination={destination}
        t={t}
      />
    )).toMatchSnapshot()
  })
})
