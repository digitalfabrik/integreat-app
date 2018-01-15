import React from 'react'
import { shallow } from 'enzyme'
import Caption from '../Caption'

describe('Caption', () => {
  test('should render', () => {
    expect(shallow(<Caption title={'Test Title'} />)).toMatchSnapshot()
  })
})
