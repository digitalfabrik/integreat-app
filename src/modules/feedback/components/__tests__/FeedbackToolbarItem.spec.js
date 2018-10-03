// @flow

import React from 'react'
import { shallow } from 'enzyme'

import { FeedbackToolbarItem } from '../FeedbackToolbarItem'
import { CATEGORIES_ROUTE } from '../../../../modules/app/routes/categories'

describe('FeedbackToolbarItem', () => {
  const t = (key: ?string): string => key || ''

  it('should render a positive FeedbackToolbarItem', () => {
    const component = shallow(
      <FeedbackToolbarItem
        openFeedbackModal={() => {}}
        location={{type: CATEGORIES_ROUTE, payload: {city: 'augsburg', language: 'de'}}}
        t={t}
        isPositiveRatingLink />
    )
    expect(component).toMatchSnapshot()
  })

  it('should render a negative FeedbackToolbarItem', () => {
    const component = shallow(
      <FeedbackToolbarItem
        openFeedbackModal={() => {}}
        location={{type: CATEGORIES_ROUTE, payload: {city: 'augsburg', language: 'de'}}}
        t={t}
        isPositiveRatingLink={false} />
    )
    expect(component).toMatchSnapshot()
  })
})
