import { shallow } from 'enzyme'
import React from 'react'

import LocationToolbar from '../LocationToolbar'

jest.mock('react-i18next')

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
