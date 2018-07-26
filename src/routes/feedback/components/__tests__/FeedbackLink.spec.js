import React from 'react'
import { shallow } from 'enzyme'

import { FeedbackLink } from '../FeedbackLink'

describe('FeedbackLink', () => {
  it('should render a positive FeedbackLink', () => {
    const component = shallow(
      <FeedbackLink city={'augsburg'} language={'de'} t={key => key} isPositiveRating pageId={1234} />
    )
    expect(component).toMatchSnapshot()
  })

  it('should render a negative FeedbackLink', () => {
    const component = shallow(
      <FeedbackLink city={'augsburg'} language={'de'} t={key => key} isPositiveRating={false} pageId={1234} />
    )
    expect(component).toMatchSnapshot()
  })
})
