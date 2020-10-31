// @flow

import React from 'react'
import Footer from '../Footer'
import { shallow } from 'enzyme'

describe('Footer', () => {
  it('should insert items', () => {
    const component = <Footer>
      <div>MockNode</div>
      <div>AnotherMockNode</div>
    </Footer>
    expect(shallow(component)).toMatchSnapshot()
  })

  it('should show Version on dev builds', () => {
    const preVersion = global.__VERSION__
    global.__VERSION__ = 'vX.X'
    expect(shallow(<Footer><div>MockNode</div><div>AnotherMockNode</div></Footer>)).toMatchSnapshot()
    global.__VERSION__ = preVersion
  })
})
