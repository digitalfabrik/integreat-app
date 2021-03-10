// @flow

import React from 'react'
import Footer from '../Footer'
import { shallow } from 'enzyme'

describe('Footer', () => {
  it('should insert items', () => {
    const preVersion = global.__VERSION_NAME__
    const preSha = global.__COMMIT_SHA__
    global.__VERSION_NAME__ = '2020.1.1'
    global.__COMMIT_SHA__ = 'f3ef76e3'
    const component = <Footer>
      <div>MockNode</div>
      <div>AnotherMockNode</div>
    </Footer>
    expect(shallow(component)).toMatchSnapshot()
    global.__VERSION_NAME__ = preVersion
    global.__COMMIT_SHA__ = preSha
  })

  it('should show Version on dev builds', () => {
    const preVersion = global.__VERSION_NAME__
    const preSha = global.__COMMIT_SHA__
    global.__VERSION_NAME__ = '2020.1.1'
    global.__COMMIT_SHA__ = 'f3ef76e3'
    expect(shallow(<Footer><div>MockNode</div><div>AnotherMockNode</div></Footer>)).toMatchSnapshot()
    global.__VERSION_NAME__ = preVersion
    global.__COMMIT_SHA__ = preSha
  })
})
