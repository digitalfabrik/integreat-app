import React from 'react'
import { shallow } from 'enzyme'
import FeedbackToolbarItem from '../FeedbackToolbarItem'
import { faFrown, faSmile } from '../../constants/icons'

jest.mock('react-i18next')

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
