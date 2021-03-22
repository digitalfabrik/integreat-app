// @flow

import React from 'react'
import { shallow } from 'enzyme'

import LocationToolbar from '../LocationToolbar'

jest.mock('react-i18next')

describe('LocationToolbar', () => {
  it('should match snapshot', () => {
    const component = shallow(
      <LocationToolbar openFeedbackModal={() => {}} viewportSmall direction={'ltr'}>
        <div>MockNode</div>
      </LocationToolbar>
    )

    expect(component).toMatchSnapshot()
  })
})
