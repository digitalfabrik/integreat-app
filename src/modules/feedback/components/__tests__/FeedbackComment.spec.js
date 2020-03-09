// @flow

import React from 'react'
import { shallow } from 'enzyme'

import FeedbackComment from '../FeedbackComment'

describe('FeedbackComment', () => {
  const onCommentChanged = (event: SyntheticInputEvent<HTMLTextAreaElement>) => undefined

  it('should match snapshot', () => {
    const component = shallow(
      <FeedbackComment comment='Nice app!' commentMessage='message' onCommentChanged={onCommentChanged} />
    )
    expect(component).toMatchSnapshot()
  })
})
