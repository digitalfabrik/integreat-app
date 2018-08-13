// @flow

import React from 'react'
import { FeedbackThanksMessage } from '../FeedbackThanksMessage'
import { CATEGORIES_ROUTE } from '../../../../modules/app/routes/categories'
import { shallow } from 'enzyme'

describe('FeedbackThanksMessage', () => {
  it('should match snapshot', () => {
    const location = {type: CATEGORIES_ROUTE, payload: {city: 'augsburg', language: 'de'}, query: {feedback: 'sent'}}
    const t = (key: ?string): string => key || ''
    expect(shallow(
      <FeedbackThanksMessage location={location} t={t} />
    )).toMatchSnapshot()
  })
})
