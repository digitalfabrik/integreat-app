// @flow

import React from 'react'
import { shallow } from 'enzyme'
import moment from 'moment-timezone'
import TunewsDetailsFooter from '../TunewsDetailsFooter'

describe('TunewsDetailsFooter', () => {
  const language = 'en'
  const date = moment.tz('2020-03-20 17:50:00', 'GMT')
  const t = (key: ?string): string => key || ''

  it('should render and match snapshot', () => {
    expect(shallow(
      <TunewsDetailsFooter
        eNewsNo='tun0000009902'
        date={date}
        language={language}
        t={t}
      />
    )).toMatchSnapshot()
  })

  it('should render the right data', () => {
    const wrapper = shallow(
      <TunewsDetailsFooter
        eNewsNo='tun0000009902'
        date={date}
        language={language}
        t={t}
      />
    )
    expect(wrapper.text()).toContain('tun0000009902')
  })
})
