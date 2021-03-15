// @flow

import React from 'react'
import { shallow } from 'enzyme'
import { faFrown, faSmile } from '../../../../modules/app/constants/icons'
import FeedbackToolbarItem from '../FeedbackToolbarItem'

describe('FeedbackToolbarItem', () => {
  it('should render a positive FeedbackToolbarItem', () => {
    const component = shallow(<FeedbackToolbarItem openFeedbackModal={() => {}} isPositiveRatingLink viewportSmall />)
    expect(component.find(faSmile)).not.toBeNull()
  })

  it('should render a negative FeedbackToolbarItem', () => {
    const component = shallow(
      <FeedbackToolbarItem openFeedbackModal={() => {}} isPositiveRatingLink={false} viewportSmall />
    )
    expect(component.find(faFrown)).not.toBeNull()
  })
})
