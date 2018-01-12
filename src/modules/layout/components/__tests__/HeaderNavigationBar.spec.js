import React from 'react'
import { shallow } from 'enzyme'
import HeaderNavigationBar from '../HeaderNavigationBar'
import HeaderNavigationItem from '../../HeaderNavigationItem'

describe('HeaderNavigationBar', () => {
  test('should match snapshot', () => {
    const component = shallow(
      <HeaderNavigationBar className='testClass' items={[
        new HeaderNavigationItem({href: 'link1', text: 'text1'}),
        new HeaderNavigationItem({href: 'link2', text: 'text2'})
      ]} />
    )
    expect(component).toMatchSnapshot()
  })

  test('should add a class when no items supplied', () => {
    const component = shallow(<HeaderNavigationBar items={[]} />)
    expect(component.find('div').prop('className')).toEqual('navigationBar hidden')
  })
})
