// @flow

import React from 'react'
import { shallow } from 'enzyme'

import { FeedbackComment } from '../FeedbackComment'

describe('FeedbackComment', () => {
  const t = (key: ?string): string => key || ''
  const onCommentChanged = (event: SyntheticInputEvent<HTMLTextAreaElement>) => undefined

  it('should render a comment with positive feedback description', () => {
    const component = shallow(
      <FeedbackComment comment={'Nice app!'} t={t} isPositiveRatingSelected onCommentChanged={onCommentChanged} />
    )
    expect(component).toMatchSnapshot()
  })

  it('should render a comment with negative feedback description', () => {
    const component = shallow(
      <FeedbackComment comment={'NiceApp'} t={t} isPositiveRatingSelected={false} onCommentChanged={onCommentChanged} />
    )
    expect(component).toMatchSnapshot()
  })

  it('should render a comment with the commentMessageOverride', () => {
    const component = shallow(
      <FeedbackComment
        commentMessageOverride={'override'}
        comment={'Nice app!'}
        t={t}
        isPositiveRatingSelected={false} onCommentChanged={onCommentChanged} />
    )
    expect(component).toMatchSnapshot()
  })
})
