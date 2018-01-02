import React from 'react'
import { shallow } from 'enzyme'
import HeaderMenuBar from '../components/HeaderMenuBar'

describe('HeaderMenuBar', () => {
  test('should match snapshot', () => {
    const component = shallow(
      <HeaderMenuBar className='testClass' items={[
        {href: 'link1', text: 'text1'},
        {href: 'link2', text: 'text2'}
      ]} />
    )
    expect(component).toMatchSnapshot()
  })

  test('should add a class when no items supplied', () => {
    const component = shallow(<HeaderMenuBar items={[]} />)
    expect(component.find('div').prop('className')).toEqual('menuBar hidden')
  })
})
