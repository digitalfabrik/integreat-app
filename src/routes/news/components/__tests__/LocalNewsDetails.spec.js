// @flow

import React from 'react'
import { shallow } from 'enzyme'
import LocalNewsDetails from '../LocalNewsDetails'

describe('LocalNewsDetails', () => {
  const language = 'en'
  const title = 'Some title'
  const message = 'This a push notifications message'
  const timestamp = '2020-05-02 18:31:25'

  it('should render and match snapshot', () => {
    expect(shallow(
      <LocalNewsDetails title={title} message={message} timestamp={timestamp} language={language} />
    )).toMatchSnapshot()
  })
})
