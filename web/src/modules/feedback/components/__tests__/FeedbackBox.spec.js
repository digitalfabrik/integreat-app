// @flow

import React from 'react'
import { shallow } from 'enzyme'
import { FeedbackBox } from '../FeedbackBox'
import FeedbackVariant from '../../FeedbackVariant'
import { CATEGORIES_FEEDBACK_TYPE, CONTENT_FEEDBACK_CATEGORY } from 'api-client'

describe('FeedbackBox', () => {
  const t = (key: ?string): string => key || ''
  const feedbackOptions = [
    new FeedbackVariant({
      label: 'label',
      feedbackType: CATEGORIES_FEEDBACK_TYPE,
      feedbackCategory: CONTENT_FEEDBACK_CATEGORY
    })
  ]
  const onCommentChanged = (event: SyntheticInputEvent<HTMLTextAreaElement>) => {}
  const onContactMailChanged = (event: SyntheticInputEvent<HTMLInputElement>) => {}
  const onFeedbackOptionChanged = (option: FeedbackVariant) => {}
  const onSubmit = () => {}

  it('should match snapshot', () => {
    const component = shallow(
      <FeedbackBox
        isPositiveRatingSelected={false}
        contactMail=''
        comment=''
        feedbackOptions={feedbackOptions}
        selectedFeedbackOption={feedbackOptions[0]}
        onCommentChanged={onCommentChanged}
        onFeedbackOptionChanged={onFeedbackOptionChanged}
        onContactMailChanged={onContactMailChanged}
        onSubmit={onSubmit}
        sendingStatus='SUCCESS'
        t={t}
        closeFeedbackModal={() => {}} />
    )
    expect(component).toMatchSnapshot()
  })
})
