import React from 'react'
import { shallow } from 'enzyme'

import { FeedbackComment } from '../FeedbackComment'

describe('FeedbackComment', () => {
  it('should render a comment with positive feedback description', () => {
    const component = shallow(
      <FeedbackComment comment={'Nice app!'} t={key => key} isPositiveRatingSelected />
    )
    expect(component).toMatchSnapshot()
  })

  it('should render a comment with negative feedback description', () => {
    const component = shallow(
      <FeedbackComment comment={'Nice app!'} t={key => key} isPositiveRatingSelected={false} />
    )
    expect(component).toMatchSnapshot()
  })

  it('should render a comment with the commentMessageOverride', () => {
    const component = shallow(
      <FeedbackComment
        commentMessageOverride={'override'}
        comment={'Nice app!'}
        t={key => key}
        isPositiveRatingSelected={false} />
    )
    expect(component).toMatchSnapshot()
  })
})
