import React from 'react'
import { shallow } from 'enzyme'

import { FeedbackLink } from '../FeedbackLink'
import { CATEGORIES_ROUTE } from '../../../../modules/app/routes/categories'

describe('FeedbackLink', () => {
  it('should render a positive FeedbackLink', () => {
    const component = shallow(
      <FeedbackLink
        location={{type: CATEGORIES_ROUTE, payload: {city: 'augsburg', language: 'de'}}}
        t={key => key}
        isPositiveRatingLink />
    )
    expect(component).toMatchSnapshot()
  })

  it('should render a negative FeedbackLink', () => {
    const component = shallow(
      <FeedbackLink
        location={{type: CATEGORIES_ROUTE, payload: {city: 'augsburg', language: 'de'}}}
        t={key => key}
        isPositiveRatingLink={false} />
    )
    expect(component).toMatchSnapshot()
  })
})
