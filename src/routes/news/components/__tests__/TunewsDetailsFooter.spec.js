// @flow

import React from 'react'
import { shallow } from 'enzyme'
import moment from 'moment-timezone'
import TunewsDetailsFooter from '../TunewsDetailsFooter'

describe('TunewsDetailsFooter', () => {
  const language = 'en'
  const date = moment.tz('2020-03-20 17:50:00', 'GMT')

  it('should render the right data', () => {
    const wrapper = shallow(
      <TunewsDetailsFooter
        eNewsNo='tun0000009902'
        date={date}
        language={language}
      />
    )
    expect(wrapper.text()).toContain('tun0000009902')
  })
})
