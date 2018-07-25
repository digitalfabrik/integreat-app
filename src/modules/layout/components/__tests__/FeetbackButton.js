import React from 'react'
import { shallow } from 'enzyme'

import { FeedbackButton } from '../FeedbackButton'

describe('FeedbackButton', () => {
  it('should render a positive FeedbackButton', () => {
    const component = shallow(
      <FeedbackButton city={'augsburg'} language={'de'} t={key => key} isPositiveRating pageId={1234} />
    )
    expect(component).toMatchSnapshot()
  })

  it('should render a negative FeedbackButton', () => {
    const component = shallow(
      <FeedbackButton city={'augsburg'} language={'de'} t={key => key} isPositiveRating={false} pageId={1234} />
    )
    expect(component).toMatchSnapshot()
  })
})
