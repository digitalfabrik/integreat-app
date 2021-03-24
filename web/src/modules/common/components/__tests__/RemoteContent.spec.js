// @flow

import React from 'react'
import { shallow } from 'enzyme'
import RemoteContent from '../RemoteContent'

describe('RemoteContent', () => {
  it('should render', () => {
    expect(
      shallow(
        <RemoteContent dangerouslySetInnerHTML={{ __html: '<div> Test html </div>' }} onInternalLinkClick={() => {}} />
      )
    ).toMatchSnapshot()
  })

  it('should render and have centered props', () => {
    expect(
      shallow(
        <RemoteContent
          centered
          dangerouslySetInnerHTML={{ __html: '<div> Test html </div>' }}
          onInternalLinkClick={() => {}}
        />
      )
    ).toMatchSnapshot()
  })
})
