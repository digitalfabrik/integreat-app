// @flow

import React from 'react'
import { shallow } from 'enzyme'
import { FeedbackBox } from '../FeedbackBox'
import FeedbackDropdownItem from '../../FeedbackDropdownItem'
import { CATEGORIES_FEEDBACK_TYPE, CONTENT_FEEDBACK_CATEGORY } from '@integreat-app/integreat-api-client'

describe('FeedbackBox', () => {
  const t = (key: ?string): string => key || ''
  const feedbackOptions = [
    new FeedbackDropdownItem({
      label: 'label',
      feedbackType: CATEGORIES_FEEDBACK_TYPE,
      feedbackCategory: CONTENT_FEEDBACK_CATEGORY
    })
  ]
  const onCommentChanged = (event: SyntheticInputEvent<HTMLTextAreaElement>) => {}
  const onFeedbackOptionChanged = (option: FeedbackDropdownItem) => {}
  const onSubmit = () => {}

  it('should match snapshot', () => {
    const component = shallow(
      <FeedbackBox
        isPositiveRatingSelected={false}
        comment=''
        feedbackOptions={feedbackOptions}
        selectedFeedbackOption={feedbackOptions[0]}
        onCommentChanged={onCommentChanged}
        onFeedbackOptionChanged={onFeedbackOptionChanged}
        onSubmit={onSubmit}
        t={t}
        closeFeedbackModal={() => {}} />
    )
    expect(component).toMatchSnapshot()
  })
})
