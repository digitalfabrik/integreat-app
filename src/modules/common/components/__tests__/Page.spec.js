import React from 'react'
import { shallow } from 'enzyme'
import Page from '../Page'

describe('Page', () => {
  test('should render', () => {
    expect(shallow(<Page title={'Test Title'} content={'This is a test content'} />)).toMatchSnapshot()
  })
})
