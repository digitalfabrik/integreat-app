import { shallow } from 'enzyme'
import React from 'react'

import { faFrown, faSmile } from '../../constants/icons'
import FeedbackToolbarItem from '../FeedbackToolbarItem'

jest.mock('react-i18next')

describe('FeedbackToolbarItem', () => {
  it('should render a positive FeedbackToolbarItem', () => {
    const component = shallow(
      <FeedbackToolbarItem openFeedbackModal={() => undefined} isPositiveRatingLink viewportSmall />
    )
    expect(component.find(faSmile)).not.toBeNull()
  })

  it('should render a negative FeedbackToolbarItem', () => {
    const component = shallow(
      <FeedbackToolbarItem openFeedbackModal={() => undefined} isPositiveRatingLink={false} viewportSmall />
    )
    expect(component.find(faFrown)).not.toBeNull()
  })
})
