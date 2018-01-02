import React from 'react'
import HeaderActionBar from '../components/HeaderActionBar'
import { shallow } from 'enzyme'

describe('HeaderActionBar', () => {
  test('should match snapshot', () => {
    const component = shallow(
      <HeaderActionBar className='testClass' items={[
        {iconSrc: 'icon1', href: 'link1'},
        {iconSrc: 'icon2', dropDownNode: <div id='2' />},
        {iconSrc: 'icon3', dropDownNode: <div id='3' />}
      ]} />
    )
    expect(component).toMatchSnapshot()
  })
})
