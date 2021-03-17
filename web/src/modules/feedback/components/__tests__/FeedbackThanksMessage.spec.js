// @flow

import React from 'react'
import { FeedbackThanksMessage } from '../FeedbackThanksMessage'
import { shallow } from 'enzyme'

describe('FeedbackThanksMessage', () => {
  it('should match snapshot', () => {
    const t = (key: ?string): string => key || ''
    expect(shallow(<FeedbackThanksMessage closeFeedbackModal={() => {}} t={t} />)).toMatchSnapshot()
  })
})
