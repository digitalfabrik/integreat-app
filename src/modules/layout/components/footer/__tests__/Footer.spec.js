import React from 'react'
import Footer from '../Footer'
import { shallow } from 'enzyme'

describe('Footer', () => {
  it('should insert items', () => {
    const component = <Footer items={[
        { text: 'item1', href: '/link1' },
        { text: 'item2', href: '/link2' }
      ]} />
    expect(shallow(component)).toMatchSnapshot()
  })

  it('should show Version on dev builds', () => {
    const preDev = global.__DEV__ = true
    const preVersion = global.__VERSION__ = 'vX.X'
    expect(shallow(<Footer items={[]} />)).toMatchSnapshot()
    global.__DEV__ = preDev
    global.__VERSION__ = preVersion
  })
})
