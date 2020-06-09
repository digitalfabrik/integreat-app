// @flow

import React from 'react'
import HeaderActionBar from '../HeaderActionBar'
import { shallow } from 'enzyme'
import HeaderActionItemLink from '../HeaderActionItemLink'
import { HeaderActionItemDropDown } from '../HeaderActionItemDropDown'

describe('HeaderActionBar', () => {
  it('should match snapshot', () => {
    const component = shallow(
      <HeaderActionBar className='testClass'>
        <HeaderActionItemLink text='text1' iconSrc='icon1' href='/random_route' />,
        <HeaderActionItemDropDown iconSrc='icon2' text='text2'>
          <div id='2' />
        </HeaderActionItemDropDown>,
        <HeaderActionItemDropDown iconSrc='icon3' text='text3'>
          <div id='2' />
        </HeaderActionItemDropDown>,
      </HeaderActionBar>
    )
    expect(component).toMatchSnapshot()
  })
})
