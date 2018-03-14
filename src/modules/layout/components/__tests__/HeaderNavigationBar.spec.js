import React from 'react'
import { shallow } from 'enzyme'
import HeaderNavigationBar from '../HeaderNavigationBar'
import HeaderNavigationItem from '../HeaderNavigationItem'

describe('HeaderNavigationBar', () => {
  it('should match snapshot', () => {
    const component = shallow(
      <HeaderNavigationBar className='testClass'>
        <HeaderNavigationItem href='link1' text='text1' active selected />
        <HeaderNavigationItem href='link2' text='text2' selected={false} active={false} tooltip='tooltip1' />
      </HeaderNavigationBar>
    )
    expect(component).toMatchSnapshot()
  })

  it('should add a class when no items supplied', () => {
    const component = shallow(<HeaderNavigationBar />)
    expect(component.find('div').prop('className')).toEqual('navigationBar hidden')
  })
})
