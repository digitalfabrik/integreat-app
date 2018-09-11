// @flow

import React from 'react'
import { shallow } from 'enzyme'

import { FeedbackLink } from '../FeedbackLink'
import { CATEGORIES_ROUTE } from '../../../../modules/app/routes/categories'

describe('FeedbackLink', () => {
  const t = (key: ?string): string => key || ''

  it('should render a positive FeedbackLink', () => {
    const component = shallow(
      <FeedbackLink
        openFeedbackModal={() => {}}
        location={{type: CATEGORIES_ROUTE, payload: {city: 'augsburg', language: 'de'}}}
        t={t}
        isPositiveRatingLink />
    )
    expect(component).toMatchSnapshot()
  })

  it('should render a negative FeedbackLink', () => {
    const component = shallow(
      <FeedbackLink
        openFeedbackModal={() => {}}
        location={{type: CATEGORIES_ROUTE, payload: {city: 'augsburg', language: 'de'}}}
        t={t}
        isPositiveRatingLink={false} />
    )
    expect(component).toMatchSnapshot()
  })
})
