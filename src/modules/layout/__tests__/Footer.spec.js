import React from 'react'
import Footer from '../components/Footer'
import { shallow } from 'enzyme'

describe('Footer', () => {
  test('should insert items', () => {
    const component = <Footer items={[
        { text: 'item1', href: '/link1' },
        { text: 'item2', href: '/link2' }
      ]} />
    expect(shallow(component)).toMatchSnapshot()
  })

  test('should show Version on dev builds', () => {
    global.__DEV__ = true
    global.__VERSION__ = 'vX.X'
    expect(shallow(<Footer items={[]} />)).toMatchSnapshot()
  })
})
