// @flow

import React from 'react'
import HeaderActionBar from '../HeaderActionBar'
import { shallow } from 'enzyme'
import HeaderActionItem from '../../HeaderActionItem'

describe('HeaderActionBar', () => {
  it('should match snapshot', () => {
    const component = shallow(
      <HeaderActionBar className='testClass' items={[
        new HeaderActionItem({ iconSrc: 'icon1', href: '/random_route' }),
        new HeaderActionItem({ node: <div id='2' /> }),
        new HeaderActionItem({ node: <div id='3' /> })
      ]} />
    )
    expect(component).toMatchSnapshot()
  })
})
