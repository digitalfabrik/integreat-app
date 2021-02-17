// @flow

import React from 'react'
import { shallow } from 'enzyme'
import { faFrown, faSmile } from '../../../../modules/app/constants/icons'
import FeedbackToolbarItem from '../FeedbackToolbarItem'

describe('FeedbackToolbarItem', () => {
  const t = (key: ?string): string => key || ''

  it('should render a positive FeedbackToolbarItem', () => {
    const component = shallow(
      <FeedbackToolbarItem
        openFeedbackModal={() => {}}
        t={t}
        isPositiveRatingLink
        viewportSmall />
    )
    expect(component.find(faSmile)).not.toBeNull()
  })

  it('should render a negative FeedbackToolbarItem', () => {
    const component = shallow(
      <FeedbackToolbarItem
        openFeedbackModal={() => {}}
        t={t}
        isPositiveRatingLink={false}
        viewportSmall />
    )
    expect(component.find(faFrown)).not.toBeNull()
  })
})
