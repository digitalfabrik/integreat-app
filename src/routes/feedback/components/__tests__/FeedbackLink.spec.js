import React from 'react'
import { shallow } from 'enzyme'

import { FeedbackLink } from '../FeedbackLink'

describe('FeedbackLink', () => {
  it('should render a positive FeedbackLink', () => {
    const component = shallow(
      <FeedbackLink pathname={'/augsburg/de'} t={key => key} isPositiveRatingLink />
    )
    expect(component).toMatchSnapshot()
  })

  it('should render a negative FeedbackLink', () => {
    const component = shallow(
      <FeedbackLink pathname={'/augsburg/de'} t={key => key} isPositiveRatingLink={false} />
    )
    expect(component).toMatchSnapshot()
  })
})
