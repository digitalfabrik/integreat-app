// @flow

import React from 'react'
import { shallow } from 'enzyme'

import { CATEGORIES_ROUTE } from '../../../../modules/app/routes/categories'
import { FeedbackBox } from '../FeedbackBox'
import FeedbackDropdownItem from '../../FeedbackDropdownItem'
import { CATEGORIES_FEEDBACK_TYPE } from '../../../../modules/endpoint/FeedbackEndpoint'

describe('FeedbackBox', () => {
  const location = {type: CATEGORIES_ROUTE, payload: {city: 'augsburg', language: 'de'}}
  const t = (key: ?string): string => key || ''
  const feedbackOptions = [new FeedbackDropdownItem('label', CATEGORIES_FEEDBACK_TYPE)]
  const onCommentChanged = (event: SyntheticInputEvent<HTMLTextAreaElement>) => {}
  const onFeedbackOptionChanged = (option: FeedbackDropdownItem) => {}
  const onSubmit = () => {}

  it('should match snapshot', () => {
    const component = shallow(
      <FeedbackBox
        location={location}
        isPositiveRatingSelected={false}
        comment={''}
        feedbackOptions={feedbackOptions}
        selectedFeedbackOption={feedbackOptions[0]}
        onCommentChanged={onCommentChanged}
        onFeedbackOptionChanged={onFeedbackOptionChanged}
        onSubmit={onSubmit}
        t={t} />
    )
    expect(component).toMatchSnapshot()
  })
})
