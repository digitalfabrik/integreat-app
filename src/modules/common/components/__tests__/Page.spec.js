// @flow

import React from 'react'
import { shallow } from 'enzyme'
import moment from 'moment-timezone'
import Page from '../Page'

describe('Page', () => {
  const title = 'first Event'
  const lastUpdate = moment('2016-01-07T10:36:24.000Z', moment.ISO_8601)
  const content = 'content'
  const thumbnail = 'thumbnail'

  const language = 'en'

  it('should render', () => {
    expect(shallow(<Page title={title}
                         lastUpdate={lastUpdate}
                         content={content}
                         thumbnail={thumbnail}
                         language={language}
                         onInternalLinkClick={() => {}} />
    )).toMatchSnapshot()
  })
})
