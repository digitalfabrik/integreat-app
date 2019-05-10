// @flow

import Caption from '../Caption'
import { shallow } from 'react-native-testing-library'
import React from 'react'
import { darkTheme } from '../../../theme/constants/theme'

describe('Caption', () => {
  it('should render and display a Caption', () => {
    const wrapper = shallow(
      <Caption title={'This is a test title!'} theme={darkTheme} />
    )
    expect(wrapper).toMatchSnapshot()
  })
})
