// @flow

import Caption from '../Caption'
import { shallow } from 'react-native-testing-library'
import React from 'react'

describe('Caption', () => {
  it('should render and display a Caption', () => {
    const wrapper = shallow(
      <Caption title={'This is a test title!'} />
    )
    expect(wrapper).toMatchSnapshot()
  })
})
