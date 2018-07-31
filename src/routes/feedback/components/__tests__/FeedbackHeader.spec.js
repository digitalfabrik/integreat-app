import React from 'react'
import { shallow } from 'enzyme'

import { CATEGORIES_FEEDBACK_TYPE, PAGE_FEEDBACK_TYPE } from '../../../../modules/endpoint/FeedbackEndpoint'
import { FeedbackHeader } from '../FeedbackHeader'
import { CATEGORIES_ROUTE } from '../../../../modules/app/routes/categories'

describe('FeedbackHeader', () => {
  it('should match snapshot', () => {
    const feedbackOptions = [
      {value: 'Inhalte von Willkommen', label: 'Inhalte von Willkommen', feedbackType: PAGE_FEEDBACK_TYPE},
      {value: 'Inhalte von Augsburg', label: 'Inhalte von Augsburg', feedbackType: CATEGORIES_FEEDBACK_TYPE},
      {value: 'App', label: 'App', feedbackType: CATEGORIES_FEEDBACK_TYPE}
    ]

    const location = {type: CATEGORIES_ROUTE, payload: {city: 'augsburg', language: 'de'}}

    const component = shallow(
      <FeedbackHeader
        location={location}
        feedbackOptions={feedbackOptions}
        selectedFeedbackOption={feedbackOptions[0]}
        t={key => key}
        onFeedbackOptionChanged={() => {}} />
    )
    expect(component).toMatchSnapshot()
  })
})
