// @flow

import React from 'react'
import { shallow } from 'enzyme'

import LocationToolbar from '../LocationToolbar'

describe('LocationToolbar', () => {
  it('should match snapshot', () => {
    const component = shallow(
      <LocationToolbar openFeedbackModal={() => {}} viewportSmall>
        <div>MockNode</div>
      </LocationToolbar>
    )

    expect(component).toMatchSnapshot()
  })
})
