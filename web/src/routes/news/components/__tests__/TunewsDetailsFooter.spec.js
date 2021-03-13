// @flow

import React from 'react'
import { shallow } from 'enzyme'
import moment from 'moment'
import TunewsDetailsFooter from '../TunewsDetailsFooter'
import DateFormatter from 'api-client/src/i18n/DateFormatter'

describe('TunewsDetailsFooter', () => {
  const language = 'en'
  const date = moment('2020-03-20T17:50:00.000Z')

  it('should render the right data', () => {
    const wrapper = shallow(
      <TunewsDetailsFooter eNewsNo='tun0000009902' date={date} formatter={new DateFormatter(language)} />
    )
    expect(wrapper.text()).toContain('tun0000009902')
  })
})
