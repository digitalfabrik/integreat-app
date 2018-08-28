// @flow

import React from 'react'
import { shallow } from 'enzyme'
import Page from '../Page'

describe('Page', () => {
  it('should render', () => {
    expect(shallow(<Page title={'Test Title'} content={'This is a test content'}
                         onInternLinkClick={() => {}} />)).toMatchSnapshot()
  })
})
